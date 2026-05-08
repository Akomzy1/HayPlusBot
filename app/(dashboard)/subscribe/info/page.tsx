import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Clock, CheckCircle2, Mail } from "lucide-react";
import { requireDisclosureSigned } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your HFcopy subscription",
  robots: { index: false, follow: false },
};

// HFcopy strategy deep link. The numeric strategy ID will be filled in once
// HFM provides it for the master account; until then this is a placeholder
// that links to HFM's HFcopy hub.
const HFCOPY_STRATEGY_URL =
  process.env.HFM_HFCOPY_STRATEGY_URL ?? "https://www.hfm.com/copy/";

export default async function SubscribeInfoPage() {
  const user = await requireDisclosureSigned();
  const supabase = createClient();

  const { data: signup } = await supabase
    .from("signups")
    .select(
      "hfm_account_number, hfm_account_verified_at, hfm_account_verified_under_our_code, hfcopy_subscribed",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // If they haven't recorded an account number yet, send them back to /subscribe.
  if (!signup?.hfm_account_number) {
    redirect("/subscribe");
  }

  const verified =
    Boolean(signup.hfm_account_verified_at) &&
    signup.hfm_account_verified_under_our_code;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
        Step 4 of 4
      </p>
      <h1 className="mt-6 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Your HFcopy subscription
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        You can complete your HFcopy subscription on HFM&rsquo;s platform now.
        Your dashboard here will reflect your subscription within 24&ndash;48
        hours after our next reconciliation.
      </p>

      {/* Verification status card */}
      <div
        className="mt-8 rounded-xl border p-5"
        style={
          verified
            ? {
                background: "rgba(29, 158, 117, 0.08)",
                borderColor: "rgba(29, 158, 117, 0.40)",
              }
            : {
                background: "rgba(186, 117, 23, 0.08)",
                borderColor: "rgba(186, 117, 23, 0.40)",
              }
        }
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={
              verified
                ? {
                    background: "rgba(29, 158, 117, 0.15)",
                    color: "hsl(var(--brand-teal))",
                  }
                : {
                    background: "rgba(186, 117, 23, 0.15)",
                    color: "hsl(var(--brand-amber))",
                  }
            }
          >
            {verified ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </span>
          <div>
            <p className="font-sans text-base font-medium text-foreground">
              {verified
                ? "Verified under our referral"
                : "Verification pending — typically 24–48 hours"}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              HFM account: {signup.hfm_account_number}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription summary */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-card p-6 sm:p-8">
        <h2 className="font-sans text-xl font-semibold text-foreground">
          Subscription summary
        </h2>
        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
              Strategy
            </dt>
            <dd className="mt-1 font-sans text-sm text-foreground">
              HayPlusbot &mdash; SMC/ICT A+ Setups
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
              Recommended deposit
            </dt>
            <dd className="mt-1 font-mono text-sm text-foreground">
              $100 USD equivalent
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
              Pairs
            </dt>
            <dd className="mt-1 font-sans text-sm text-foreground">
              9 majors &amp; JPY crosses
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
              Sessions
            </dt>
            <dd className="mt-1 font-sans text-sm text-foreground">
              London &middot; NY AM
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-teal hover:bg-teal/90 sm:w-auto"
          >
            <a
              href={HFCOPY_STRATEGY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open HFcopy subscription on HFM
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground/80">
          $100 minimum is guidance only. HFM enforces its own minimums on
          their HFcopy interface.
        </p>
      </div>

      {/* What happens next */}
      <div className="mt-8 rounded-xl border border-white/[0.06] bg-card p-6 sm:p-8">
        <h2 className="font-sans text-xl font-semibold text-foreground">
          What happens next
        </h2>
        <ol className="mt-5 space-y-4 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal/10 font-mono text-[11px] text-teal">
              1
            </span>
            <span>
              We verify your HFM account is under our referral
              (24&ndash;48 hours).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal/10 font-mono text-[11px] text-teal">
              2
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
              We confirm via email.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal/10 font-mono text-[11px] text-teal">
              3
            </span>
            <span>
              Your HayPlusbot dashboard updates to show your subscription
              status.
            </span>
          </li>
        </ol>

        <p className="mt-6 rounded-md bg-secondary/60 p-4 text-xs text-muted-foreground">
          If you&rsquo;re already subscribed on HFcopy, your trades start
          mirroring as soon as HFM activates the subscription on their side
          &mdash; that&rsquo;s separate from our verification timing.
        </p>
      </div>
    </div>
  );
}
