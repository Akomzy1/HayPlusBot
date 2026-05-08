/**
 * MockBrokerProvider unit tests. No DB, no env, no network — instantiates
 * the class directly so it runs anywhere Vitest runs.
 */

import { describe, expect, it } from "vitest";
import { MockBrokerProvider } from "./provider";

describe("MockBrokerProvider", () => {
  it("identifies as 'mock'", () => {
    const p = new MockBrokerProvider();
    expect(p.name).toBe("mock");
  });

  describe("signupUrl", () => {
    it("returns the HFM register URL with the mock IB code embedded", () => {
      const url = new MockBrokerProvider().signupUrl();
      expect(url).toBe(
        "https://register.hfm.com/?refid=MOCK_IB_CODE&ref=",
      );
    });

    it("includes the referral token in the ref query param when provided", () => {
      const url = new MockBrokerProvider().signupUrl("haytest-123");
      expect(url).toBe(
        "https://register.hfm.com/?refid=MOCK_IB_CODE&ref=haytest-123",
      );
    });
  });

  describe("verifyAccountUnderPartnerCode", () => {
    it("account starting with '1' is verified under our IB code", async () => {
      const r = await new MockBrokerProvider().verifyAccountUnderPartnerCode(
        "100001",
      );
      expect(r.hfmAccountNumber).toBe("100001");
      expect(r.exists).toBe(true);
      expect(r.underOurIbCode).toBe(true);
      expect(r.accountStatus).toBe("active");
      expect(r.ibCode).toBe("MOCK_IB_CODE");
      expect(r.verifiedAt).toBeInstanceOf(Date);
    });

    it("account starting with '2' exists but sits under a different IB code", async () => {
      const r = await new MockBrokerProvider().verifyAccountUnderPartnerCode(
        "200002",
      );
      expect(r.exists).toBe(true);
      expect(r.underOurIbCode).toBe(false);
      expect(r.ibCode).toBe("OTHER123");
      expect(r.accountStatus).toBe("active");
    });

    it("account starting with '9' does not exist", async () => {
      const r = await new MockBrokerProvider().verifyAccountUnderPartnerCode(
        "999999",
      );
      expect(r.exists).toBe(false);
      expect(r.underOurIbCode).toBe(false);
      expect(r.accountStatus).toBe("unknown");
      expect(r.ibCode).toBeUndefined();
    });

    it("account with any other prefix defaults to the success path", async () => {
      const r = await new MockBrokerProvider().verifyAccountUnderPartnerCode(
        "300003",
      );
      expect(r.exists).toBe(true);
      expect(r.underOurIbCode).toBe(true);
      expect(r.accountStatus).toBe("active");
    });

    it("completes within 500ms (latency simulation upper bound)", async () => {
      const start = Date.now();
      await new MockBrokerProvider().verifyAccountUnderPartnerCode("100");
      expect(Date.now() - start).toBeLessThan(500);
    });
  });

  describe("getMasterStrategyMetrics", () => {
    it("returns the seed values with current syncedAt", async () => {
      const before = Date.now();
      const m = await new MockBrokerProvider().getMasterStrategyMetrics();
      expect(m.subscribersCount).toBe(0);
      expect(m.totalMirrorVolumeLifetime).toBe(0);
      expect(m.performanceFees30d).toBe(0);
      expect(m.performanceFeesLifetime).toBe(0);
      expect(m.syncedAt).toBeInstanceOf(Date);
      expect(m.syncedAt.getTime()).toBeGreaterThanOrEqual(before);
    });

    it("completes within 500ms", async () => {
      const start = Date.now();
      await new MockBrokerProvider().getMasterStrategyMetrics();
      expect(Date.now() - start).toBeLessThan(500);
    });
  });

  describe("getActiveHfcopySubscribers", () => {
    it("returns an empty array (in v3.4 admin CSV upload provides this)", async () => {
      const list = await new MockBrokerProvider().getActiveHfcopySubscribers();
      expect(list).toEqual([]);
    });

    it("completes within 500ms", async () => {
      const start = Date.now();
      await new MockBrokerProvider().getActiveHfcopySubscribers();
      expect(Date.now() - start).toBeLessThan(500);
    });
  });
});
