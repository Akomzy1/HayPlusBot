/**
 * Pure-logic tests for the HFM reconciliation pipeline. The action wrapper
 * (DB writes, audit logging) is intentionally kept thin around these
 * helpers — testing the helpers exhaustively gives us high coverage of
 * the actual decision logic without the brittleness of an admin-authed
 * Supabase test harness.
 */

import { describe, expect, it } from "vitest";
import {
  computeReconciliationPlan,
  extractActiveAccountNumbers,
  maskEmail,
  type SignupForReconciliation,
} from "./reconcile-logic";
import { SubscriberCountSchema } from "./schema";

const NOW = new Date("2026-05-08T10:00:00.000Z");

function signup(
  partial: Partial<SignupForReconciliation> & { id: string; account: string },
): SignupForReconciliation {
  return {
    id: partial.id,
    user_id: partial.user_id ?? `user-${partial.id}`,
    email: partial.email ?? `${partial.id}@example.com`,
    hfm_account_number: partial.account,
    hfcopy_subscribed: partial.hfcopy_subscribed ?? false,
    hfm_account_verified_under_our_code:
      partial.hfm_account_verified_under_our_code ?? false,
  };
}

describe("maskEmail", () => {
  it("masks all but the first character of the local part", () => {
    expect(maskEmail("john.doe@example.com")).toBe("j***@example.com");
  });
  it("returns input unchanged for malformed addresses", () => {
    expect(maskEmail("not-an-email")).toBe("not-an-email");
  });
});

describe("extractActiveAccountNumbers", () => {
  it("includes only rows whose status is active or absent", () => {
    const rows = [
      { account_number: "10000001", status: "active" },
      { account_number: "10000002", status: "ACTIVE" }, // case-insensitive
      { account_number: "10000003", status: "closed" },
      { account_number: "10000004", status: "" }, // missing status → active
      { account_number: "10000005" }, // no status field at all → active
      { account_number: "10000006", status: "suspended" },
    ];
    const set = extractActiveAccountNumbers(rows);
    expect([...set].sort()).toEqual([
      "10000001",
      "10000002",
      "10000004",
      "10000005",
    ]);
  });
  it("trims whitespace and stringifies numeric account fields", () => {
    const rows = [
      { account_number: "  10000007  ", status: "active" },
      { account_number: 10000008, status: "active" },
    ];
    const set = extractActiveAccountNumbers(rows);
    expect(set.has("10000007")).toBe(true);
    expect(set.has("10000008")).toBe(true);
  });
});

describe("computeReconciliationPlan", () => {
  it("marks newly verified + newly subscribed when matching account appears for the first time", () => {
    const plan = computeReconciliationPlan({
      signups: [
        signup({ id: "s1", account: "10000001" }),
      ],
      activeAccountNumbers: new Set(["10000001"]),
      totalInUpload: 1,
      now: NOW,
    });
    expect(plan.summary.newlyVerified).toBe(1);
    expect(plan.summary.newlySubscribed).toBe(1);
    expect(plan.summary.alreadySubscribed).toBe(0);
    expect(plan.summary.unmatchedCount).toBe(0);
    expect(plan.updates).toHaveLength(1);
    expect(plan.updates[0]?.patch).toMatchObject({
      hfm_account_verified_under_our_code: true,
      hfm_account_verified_at: NOW.toISOString(),
      hfcopy_subscribed: true,
      hfcopy_subscribed_at: NOW.toISOString(),
      hfcopy_unsubscribed_at: null,
    });
  });

  it("counts already-subscribed unchanged when match was already subscribed and verified", () => {
    const plan = computeReconciliationPlan({
      signups: [
        signup({
          id: "s1",
          account: "10000001",
          hfcopy_subscribed: true,
          hfm_account_verified_under_our_code: true,
        }),
      ],
      activeAccountNumbers: new Set(["10000001"]),
      totalInUpload: 1,
      now: NOW,
    });
    expect(plan.summary.alreadySubscribed).toBe(1);
    expect(plan.summary.newlyVerified).toBe(0);
    expect(plan.summary.newlySubscribed).toBe(0);
    expect(plan.updates).toHaveLength(0);
  });

  it("flips a previously-subscribed user to unsubscribed when no longer on HFM list", () => {
    const plan = computeReconciliationPlan({
      signups: [
        signup({
          id: "s1",
          account: "10000001",
          hfcopy_subscribed: true,
          hfm_account_verified_under_our_code: true,
        }),
      ],
      activeAccountNumbers: new Set(),
      totalInUpload: 0,
      now: NOW,
    });
    expect(plan.summary.newlyUnsubscribed).toBe(1);
    expect(plan.summary.unmatchedCount).toBe(0); // verified users aren't "unmatched"
    expect(plan.updates[0]?.patch).toMatchObject({
      hfcopy_subscribed: false,
      hfcopy_unsubscribed_at: NOW.toISOString(),
    });
  });

  it("lists unverified users not on HFM list as unmatched", () => {
    const plan = computeReconciliationPlan({
      signups: [
        signup({
          id: "s1",
          account: "10000001",
          email: "alice@example.com",
        }),
      ],
      activeAccountNumbers: new Set(["20000002"]),
      totalInUpload: 1,
      now: NOW,
    });
    expect(plan.summary.unmatchedCount).toBe(1);
    expect(plan.unmatchedUsers).toEqual([
      {
        id: "s1",
        user_id: "user-s1",
        email: "alice@example.com",
        account: "10000001",
      },
    ]);
    expect(plan.updates).toHaveLength(0);
  });

  it("handles a mixed batch correctly", () => {
    const plan = computeReconciliationPlan({
      signups: [
        // matches and was already subscribed: alreadySubscribed
        signup({
          id: "a",
          account: "10000001",
          hfcopy_subscribed: true,
          hfm_account_verified_under_our_code: true,
        }),
        // matches, was not subscribed: newlyVerified + newlySubscribed
        signup({ id: "b", account: "10000002" }),
        // does not match, was subscribed: newlyUnsubscribed
        signup({
          id: "c",
          account: "30000003",
          hfcopy_subscribed: true,
          hfm_account_verified_under_our_code: true,
        }),
        // does not match, never verified: unmatched
        signup({ id: "d", account: "40000004" }),
      ],
      activeAccountNumbers: new Set(["10000001", "10000002"]),
      totalInUpload: 5,
      now: NOW,
    });

    expect(plan.summary).toMatchObject({
      totalInUpload: 5,
      activeInUpload: 2,
      newlyVerified: 1,
      newlySubscribed: 1,
      newlyUnsubscribed: 1,
      alreadySubscribed: 1,
      unmatchedCount: 1,
    });
  });

  it("populates verified flag for a previously-subscribed-but-unverified user (edge case)", () => {
    const plan = computeReconciliationPlan({
      signups: [
        signup({
          id: "s1",
          account: "10000001",
          hfcopy_subscribed: true,
          hfm_account_verified_under_our_code: false,
        }),
      ],
      activeAccountNumbers: new Set(["10000001"]),
      totalInUpload: 1,
      now: NOW,
    });
    expect(plan.summary.newlyVerified).toBe(1);
    expect(plan.summary.alreadySubscribed).toBe(1);
  });
});

describe("SubscriberCountSchema", () => {
  it("accepts a non-negative integer + reason >= 3 chars", () => {
    expect(
      SubscriberCountSchema.safeParse({
        count: 247,
        reason: "Reconciled with CSV",
      }).success,
    ).toBe(true);
  });
  it("rejects negative counts", () => {
    expect(
      SubscriberCountSchema.safeParse({ count: -1, reason: "abc" }).success,
    ).toBe(false);
  });
  it("rejects non-integers", () => {
    expect(
      SubscriberCountSchema.safeParse({ count: 3.14, reason: "abc" }).success,
    ).toBe(false);
  });
  it("rejects reason shorter than 3 chars", () => {
    expect(
      SubscriberCountSchema.safeParse({ count: 5, reason: "ab" }).success,
    ).toBe(false);
  });
  it("trims reason before length check", () => {
    expect(
      SubscriberCountSchema.safeParse({ count: 5, reason: "  ab  " }).success,
    ).toBe(false);
  });
});
