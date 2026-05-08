import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Service-role Supabase client. Bypasses RLS — use only in trusted server
 * paths (admin actions, signed-in webhooks, scheduled jobs). Never expose
 * the underlying SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * The client doesn't persist or refresh sessions: each call is a fire-and-
 * forget privileged write/read.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "createServiceClient: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
  }
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
