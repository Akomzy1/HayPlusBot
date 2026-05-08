"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  recordHfmAccount,
  type RecordResult,
} from "@/app/(dashboard)/subscribe/actions";

const SERVERS = ["HFM-Real", "HFM-Real-Plus", "HFM-Real-Pro"] as const;

const initialState: RecordResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="w-full bg-teal hover:bg-teal/90"
    >
      {pending ? "Recording…" : "Record account number"}
      {pending ? null : <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}

export function AccountRecordingForm({
  hfmReferralUrl,
}: {
  hfmReferralUrl: string;
}) {
  const [state, formAction] = useFormState(recordHfmAccount, initialState);
  const router = useRouter();

  // Redirect to /subscribe/info ~2.5s after a successful recording
  useEffect(() => {
    if (state && "success" in state && state.success) {
      const t = setTimeout(() => router.push("/subscribe/info"), 2500);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  if (state && "success" in state && state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-teal/40 bg-teal/[0.08] p-6"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal/15 text-teal"
          >
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-sans text-lg font-semibold text-foreground">
              Account number recorded &#x2713;
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;ll verify your account is under our referral within
              24&ndash;48 hours via our daily reconciliation. You&rsquo;ll
              receive an email once confirmed, after which you can complete
              your HFcopy subscription on HFM&rsquo;s platform.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Redirecting to your subscription page&hellip;
            </p>
          </div>
        </div>
      </div>
    );
  }

  const errorMsg =
    state && "error" in state ? state.error : null;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="hfmAccountNumber">HFM account number</Label>
          <Input
            id="hfmAccountNumber"
            name="hfmAccountNumber"
            inputMode="numeric"
            autoComplete="off"
            pattern="\d{8}"
            maxLength={8}
            required
            placeholder="10054472"
            className="font-mono tracking-widest"
            aria-describedby={errorMsg ? "form-error" : "account-hint"}
          />
          <p id="account-hint" className="text-xs text-muted-foreground/70">
            8-digit number visible in your HFM client area.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="server">Server</Label>
          <select
            id="server"
            name="server"
            defaultValue="HFM-Real"
            required
            className="block h-10 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SERVERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {errorMsg ? (
          <p
            id="form-error"
            role="alert"
            aria-live="polite"
            className="text-sm text-destructive"
          >
            {errorMsg}
          </p>
        ) : null}

        <SubmitButton />
      </form>

      <p className="text-xs text-muted-foreground/80">
        We never ask for your trading password. Your credentials stay with
        HFM.
      </p>

      <p className="text-sm text-muted-foreground">
        Don&rsquo;t have an HFM account yet?{" "}
        <Link
          href={hfmReferralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal underline-offset-4 hover:underline"
        >
          Open one through our referral link &rarr;
        </Link>
      </p>
    </div>
  );
}
