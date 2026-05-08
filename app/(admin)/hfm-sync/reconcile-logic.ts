/**
 * Pure reconciliation logic. Given a set of HayPlusbot signups with claimed
 * HFM account numbers and a Set of "active" account numbers from the latest
 * HFM Partner Area CSV upload, compute the diff: what to update on each
 * signup row, and which users couldn't be matched.
 *
 * No side effects — actions.ts wraps this with DB calls and audit logging.
 * Keeping the diff pure makes it cheap to unit-test exhaustively.
 */

export type SignupForReconciliation = {
  id: string;
  user_id: string;
  email: string;
  hfm_account_number: string;
  hfcopy_subscribed: boolean;
  hfm_account_verified_under_our_code: boolean;
};

export type SignupUpdate = {
  hfm_account_verified_at?: string;
  hfm_account_verified_under_our_code?: boolean;
  hfcopy_subscribed?: boolean;
  hfcopy_subscribed_at?: string | null;
  hfcopy_unsubscribed_at?: string | null;
};

export type UnmatchedUser = {
  id: string;
  user_id: string;
  email: string;
  account: string;
};

export type ReconciliationSummary = {
  totalInUpload: number;
  activeInUpload: number;
  newlyVerified: number;
  newlySubscribed: number;
  newlyUnsubscribed: number;
  alreadySubscribed: number;
  unmatchedCount: number;
};

export type ReconciliationPlan = {
  /** signup id → partial update payload */
  updates: { id: string; patch: SignupUpdate }[];
  unmatchedUsers: UnmatchedUser[];
  summary: ReconciliationSummary;
};

export function computeReconciliationPlan(args: {
  signups: SignupForReconciliation[];
  activeAccountNumbers: Set<string>;
  totalInUpload: number;
  now?: Date;
}): ReconciliationPlan {
  const now = (args.now ?? new Date()).toISOString();
  const updates: { id: string; patch: SignupUpdate }[] = [];
  const unmatchedUsers: UnmatchedUser[] = [];
  let newlyVerified = 0;
  let newlySubscribed = 0;
  let newlyUnsubscribed = 0;
  let alreadySubscribed = 0;

  for (const s of args.signups) {
    const onHfmList = args.activeAccountNumbers.has(s.hfm_account_number);
    const patch: SignupUpdate = {};

    if (onHfmList) {
      if (!s.hfm_account_verified_under_our_code) {
        patch.hfm_account_verified_at = now;
        patch.hfm_account_verified_under_our_code = true;
        newlyVerified++;
      }
      if (!s.hfcopy_subscribed) {
        patch.hfcopy_subscribed = true;
        patch.hfcopy_subscribed_at = now;
        patch.hfcopy_unsubscribed_at = null;
        newlySubscribed++;
      } else {
        alreadySubscribed++;
      }
    } else {
      // not on HFM list
      if (s.hfcopy_subscribed) {
        patch.hfcopy_subscribed = false;
        patch.hfcopy_unsubscribed_at = now;
        newlyUnsubscribed++;
      }
      if (!s.hfm_account_verified_under_our_code) {
        unmatchedUsers.push({
          id: s.id,
          user_id: s.user_id,
          email: s.email,
          account: s.hfm_account_number,
        });
      }
    }

    if (Object.keys(patch).length > 0) {
      updates.push({ id: s.id, patch });
    }
  }

  return {
    updates,
    unmatchedUsers,
    summary: {
      totalInUpload: args.totalInUpload,
      activeInUpload: args.activeAccountNumbers.size,
      newlyVerified,
      newlySubscribed,
      newlyUnsubscribed,
      alreadySubscribed,
      unmatchedCount: unmatchedUsers.length,
    },
  };
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const head = local[0] ?? "";
  return `${head}***@${domain}`;
}

const ACTIVE_LIKE = new Set(["active", "live", "ok", "open"]);

/**
 * From a parsed CSV (array of row objects), extract the Set of active
 * account numbers. Rows missing a status are treated as active (HFM's
 * referred-clients export sometimes omits status for active accounts).
 */
export function extractActiveAccountNumbers(
  rows: Array<Record<string, unknown>>,
): Set<string> {
  const out = new Set<string>();
  for (const row of rows) {
    const acct = row["account_number"];
    if (acct == null || acct === "") continue;
    const status = row["status"];
    const statusStr =
      typeof status === "string" ? status.toLowerCase().trim() : "";
    const isActive = !statusStr || ACTIVE_LIKE.has(statusStr);
    if (!isActive) continue;
    out.add(String(acct).trim());
  }
  return out;
}
