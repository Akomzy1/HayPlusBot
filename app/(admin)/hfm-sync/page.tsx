import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import { UploadForm } from "./_components/upload-form";
import { CountUpdateForm } from "./_components/count-update-form";

export const metadata: Metadata = {
  title: "HFM sync — Admin",
  robots: { index: false, follow: false },
};

export default async function HfmSyncPage() {
  // Read current subscriber count for the count-update form's display.
  // Service role required because hfm_sync_state is service-role-only.
  let currentCount: number | null = null;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("hfm_sync_state")
      .select("subscribers_count")
      .eq("id", true)
      .maybeSingle();
    currentCount = data?.subscribers_count ?? null;
  } catch {
    // SUPABASE_SERVICE_ROLE_KEY not configured. The count update form
    // will surface a clearer error on submit.
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber/80">
          Admin &middot; HFM sync
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground">
          HFM reconciliation
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Upload the latest referred-clients CSV from HFM&rsquo;s Partner Area
          to reconcile against HayPlusbot signups, and manually update the
          public subscriber count when needed. Every action is recorded in
          <code className="mx-1 font-mono">admin_action_log</code> with the
          full diff.
        </p>
      </header>

      <section className="rounded-2xl border border-white/[0.06] bg-card/30 p-6 sm:p-8">
        <h2 className="font-sans text-xl font-semibold text-foreground">
          A. Subscriber reconciliation
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload the referred-clients CSV from HFM Partner Area to reconcile
          against HayPlusbot signups.
        </p>
        <div className="mt-6">
          <UploadForm />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-card/30 p-6 sm:p-8">
        <h2 className="font-sans text-xl font-semibold text-foreground">
          C. Subscriber count update
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sets <code className="font-mono">hfm_sync_state.subscribers_count</code>{" "}
          which drives the public landing-page widget (visible only when
          count &ge; 50).
        </p>
        <div className="mt-6">
          <CountUpdateForm currentCount={currentCount} />
        </div>
      </section>
    </div>
  );
}
