/**
 * Admin audit helpers, implementing the CLAUDE.md "log first → act → update
 * after_state" pattern:
 *
 *   1. logAdminAction(...)                  → INSERT row, after_state = null,
 *                                              returns id
 *   2. perform the destructive operation
 *   3. updateAdminActionAfterState(id, ...) → UPDATE only the after_state
 *                                              column (allowed by trigger
 *                                              once, only when previously
 *                                              null)
 *
 * If step 1 fails, the action aborts before mutating anything. If step 2
 * throws, callers are expected to record the failure via
 * updateAdminActionAfterState({ error: ... }) so the audit log still
 * reflects the outcome.
 */

import type { Json } from "@/lib/types/database";
import { createServiceClient } from "@/lib/supabase/service";

export interface LogAdminActionInput {
  adminUserId: string;
  actionType: string;
  targetType?: string | null;
  targetId?: string | null;
  beforeState?: Json | null;
  reasonNote?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

/** Inserts a log row with after_state null. Returns the new row's id. */
export async function logAdminAction(
  input: LogAdminActionInput,
): Promise<number> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admin_action_log")
    .insert({
      admin_user_id: input.adminUserId,
      action_type: input.actionType,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      before_state: input.beforeState ?? null,
      reason_note: input.reasonNote ?? null,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`logAdminAction failed: ${error?.message ?? "no row"}`);
  }
  return data.id;
}

/**
 * Sets after_state on a previously-logged row. The append-only trigger on
 * admin_action_log enforces that this is allowed exactly once per row, and
 * only the after_state column may change.
 */
export async function updateAdminActionAfterState(
  logId: number,
  afterState: Json,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("admin_action_log")
    .update({ after_state: afterState })
    .eq("id", logId);
  if (error) {
    throw new Error(`updateAdminActionAfterState failed: ${error.message}`);
  }
}
