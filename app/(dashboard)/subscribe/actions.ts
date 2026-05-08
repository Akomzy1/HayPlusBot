"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { RecordSchema, type RecordResult } from "./schema";

export type { RecordResult };

/**
 * Record the user's claimed HFM account number on their signups row.
 * No real-time API verification (HFM has no Partner API in v3.4) — admin
 * CSV reconciliation at /admin/hfm-sync flips the verification flags.
 *
 * Writes go through the public.record_hfm_account SECURITY DEFINER RPC,
 * which only mutates the three hfm_account_* columns and resets
 * verification to false. Other signups columns remain locked.
 */
export async function recordHfmAccount(
  _prev: RecordResult | null,
  formData: FormData,
): Promise<RecordResult> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Not authenticated", code: "AUTH_REQUIRED" };
  }

  const parsed = RecordSchema.safeParse({
    hfmAccountNumber: formData.get("hfmAccountNumber"),
    server: formData.get("server"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      error: first?.message ?? "Invalid input",
      code: "INVALID_INPUT",
    };
  }

  const { error } = await supabase.rpc("record_hfm_account", {
    p_account_number: parsed.data.hfmAccountNumber,
    p_server: parsed.data.server,
  });

  if (error) {
    return { error: "Database update failed", code: "DB_ERROR" };
  }

  revalidatePath("/subscribe");
  return { success: true };
}
