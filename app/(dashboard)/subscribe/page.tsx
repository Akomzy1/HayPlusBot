import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireDisclosureSigned } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { getBrokerProvider } from "@/lib/brokers";
import { AccountRecordingForm } from "@/components/subscribe/account-recording-form";

export const metadata: Metadata = {
  title: "Connect your HFM account",
  robots: { index: false, follow: false },
};

export default async function SubscribePage() {
  const user = await requireDisclosureSigned();

  // If the user has already recorded an HFM account number, jump to the
  // post-recording handoff page.
  const supabase = createClient();
  const { data: signup } = await supabase
    .from("signups")
    .select("hfm_account_number")
    .eq("user_id", user.id)
    .maybeSingle();

  if (signup?.hfm_account_number) {
    redirect("/subscribe/info");
  }

  const referralUrl = getBrokerProvider().signupUrl(`hp-${user.id}`);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
        Step 3 of 4
      </p>
      <h1 className="mt-6 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Connect your HFM account
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        Enter your HFM account number. We&rsquo;ll verify it&rsquo;s registered
        under our referral within 24&ndash;48 hours.
      </p>

      <div className="mt-10 rounded-xl border border-white/[0.06] bg-card p-6 sm:p-8">
        <AccountRecordingForm hfmReferralUrl={referralUrl} />
      </div>
    </div>
  );
}
