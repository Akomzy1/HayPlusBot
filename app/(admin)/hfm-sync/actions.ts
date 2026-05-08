"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import Papa from "papaparse";
import { requireAdmin } from "@/lib/auth/get-user";
import {
  logAdminAction,
  updateAdminActionAfterState,
} from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/service";
import {
  computeReconciliationPlan,
  extractActiveAccountNumbers,
  maskEmail,
  type SignupForReconciliation,
} from "./reconcile-logic";
import {
  MAX_CSV_BYTES,
  SubscriberCountSchema,
  type CountUpdateResult,
  type ReconcileResult,
  type SendVerificationResult,
} from "./schema";

function clientMeta() {
  const h = headers();
  return {
    ip:
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function reconcileHfcopySubscribers(
  _prev: ReconcileResult | null,
  formData: FormData,
): Promise<ReconcileResult> {
  const admin = await requireAdmin();
  const meta = clientMeta();

  // ── 1. Validate file ──────────────────────────────────────────────
  const file = formData.get("csv");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file uploaded" };
  }
  if (file.size > MAX_CSV_BYTES) {
    return { error: "File too large (max 10MB)" };
  }
  if (
    !file.name.toLowerCase().endsWith(".csv") &&
    file.type !== "text/csv"
  ) {
    return { error: "File must be .csv" };
  }

  // ── 2. Parse CSV ──────────────────────────────────────────────────
  const text = await file.text();
  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    return {
      error: `CSV parsing failed: ${parsed.errors[0]?.message ?? "unknown"}`,
    };
  }
  const rows = parsed.data ?? [];
  const first = rows[0];
  if (!first || !Object.prototype.hasOwnProperty.call(first, "account_number")) {
    return { error: "CSV missing required column: account_number" };
  }

  const activeAccountNumbers = extractActiveAccountNumbers(rows);
  const totalInUpload = rows.length;

  // ── 3. Read current signups (this is our before_state slice) ─────
  const supabase = createServiceClient();
  const { data: signupRows, error: fetchError } = await supabase
    .from("signups")
    .select(
      "id, user_id, email, hfm_account_number, hfcopy_subscribed, hfm_account_verified_under_our_code",
    )
    .not("hfm_account_number", "is", null);

  if (fetchError) {
    return { error: `Database fetch failed: ${fetchError.message}` };
  }

  const signups: SignupForReconciliation[] = (signupRows ?? [])
    .filter((r): r is NonNullable<typeof r> & { hfm_account_number: string } =>
      typeof r.hfm_account_number === "string",
    )
    .map((r) => ({
      id: r.id,
      user_id: r.user_id,
      email: r.email,
      hfm_account_number: r.hfm_account_number,
      hfcopy_subscribed: r.hfcopy_subscribed,
      hfm_account_verified_under_our_code:
        r.hfm_account_verified_under_our_code,
    }));

  const plan = computeReconciliationPlan({
    signups,
    activeAccountNumbers,
    totalInUpload,
  });

  // ── 4. Log first (before any DB mutation) ─────────────────────────
  let logId: number;
  try {
    logId = await logAdminAction({
      adminUserId: admin.id,
      actionType: "reconcile_hfcopy_subscribers",
      targetType: "system",
      targetId: "hfm_sync",
      beforeState: {
        file_name: file.name,
        file_size: file.size,
        total_in_upload: totalInUpload,
        active_in_upload: activeAccountNumbers.size,
        signups_with_hfm_account: signups.length,
      },
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  } catch (e) {
    return {
      error: `Audit logging failed: ${e instanceof Error ? e.message : String(e)}. No reconciliation performed.`,
    };
  }

  // ── 5. Apply updates ──────────────────────────────────────────────
  let applied = 0;
  let updateErrors: string[] = [];
  for (const u of plan.updates) {
    const { error } = await supabase
      .from("signups")
      .update(u.patch)
      .eq("id", u.id);
    if (error) {
      updateErrors.push(`${u.id}: ${error.message}`);
    } else {
      applied++;
    }
  }

  // ── 6. Record outcome on the audit row ───────────────────────────
  await updateAdminActionAfterState(logId, {
    summary: plan.summary,
    updates_applied: applied,
    update_errors: updateErrors,
    // TODO Phase 7: trigger welcome emails for newlySubscribed via Resend
  });

  revalidatePath("/admin/hfm-sync");

  return {
    success: true,
    summary: plan.summary,
    unmatchedUsers: plan.unmatchedUsers.map((u) => ({
      id: u.id,
      user_id: u.user_id,
      emailMasked: maskEmail(u.email),
      account: u.account,
    })),
  };
}

export async function updateSubscriberCount(
  _prev: CountUpdateResult | null,
  formData: FormData,
): Promise<CountUpdateResult> {
  const admin = await requireAdmin();
  const meta = clientMeta();

  const rawCount = formData.get("count");
  const rawReason = formData.get("reason");
  const parsed = SubscriberCountSchema.safeParse({
    count:
      typeof rawCount === "string" && rawCount !== ""
        ? Number(rawCount)
        : NaN,
    reason: typeof rawReason === "string" ? rawReason : "",
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const supabase = createServiceClient();

  const { data: current } = await supabase
    .from("hfm_sync_state")
    .select("subscribers_count")
    .eq("id", true)
    .maybeSingle();

  const previousCount = current?.subscribers_count ?? null;

  let logId: number;
  try {
    logId = await logAdminAction({
      adminUserId: admin.id,
      actionType: "update_subscriber_count",
      targetType: "system",
      targetId: "hfm_sync_state",
      beforeState: { previous_count: previousCount },
      reasonNote: parsed.data.reason,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  } catch (e) {
    return {
      error: `Audit logging failed: ${e instanceof Error ? e.message : String(e)}. No update performed.`,
    };
  }

  const { error } = await supabase.from("hfm_sync_state").upsert({
    id: true,
    subscribers_count: parsed.data.count,
    subscribers_synced_at: new Date().toISOString(),
  });
  if (error) {
    await updateAdminActionAfterState(logId, { error: error.message });
    return { error: `Database write failed: ${error.message}` };
  }

  await updateAdminActionAfterState(logId, {
    new_count: parsed.data.count,
    previous_count: previousCount,
  });
  revalidatePath("/admin/hfm-sync");

  return { success: true, previousCount, newCount: parsed.data.count };
}

export async function sendVerificationEmailToUnmatched(
  _prev: SendVerificationResult | null,
  formData: FormData,
): Promise<SendVerificationResult> {
  const admin = await requireAdmin();
  const meta = clientMeta();

  const userId = formData.get("user_id");
  if (typeof userId !== "string" || !userId) {
    return { error: "Missing user_id" };
  }

  let logId: number;
  try {
    logId = await logAdminAction({
      adminUserId: admin.id,
      actionType: "send_verification_followup_email",
      targetType: "user",
      targetId: userId,
      beforeState: { intent: "send_followup" },
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  } catch (e) {
    return {
      error: `Audit logging failed: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  // TODO Phase 7: send via Resend. For now we just record the intent.
  await updateAdminActionAfterState(logId, {
    sent: false,
    note: "Resend wiring lands in Phase 7; intent recorded only",
  });

  return { success: true };
}
