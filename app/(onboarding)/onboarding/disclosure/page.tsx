import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/get-user";
import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Risk disclosure",
  robots: { index: false, follow: false },
};

export default async function DisclosurePage() {
  const user = await requireUser();
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-12">
      <div className="space-y-1">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
          Risk disclosure (placeholder)
        </h1>
        <p className="text-muted-foreground">
          Signed in as <span className="font-mono text-foreground">{user.email}</span>.
        </p>
      </div>
      <div className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
        <p>
          The real three-checkpoint disclosure-signing flow lands in a later
          prompt. Until then, this page is a placeholder that satisfies the
          auth-only gating (you can reach this page once signed in, even if you
          haven't signed the disclosure).
        </p>
        <p className="mt-3">
          Once a server action UPDATEs your{" "}
          <code className="font-mono">signups.risk_disclosure_signed_at</code>,
          the disclosure-gated routes (/dashboard, /signals, /subscribe,
          /settings) will become accessible.
        </p>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="sm">
          Log out
        </Button>
      </form>
    </main>
  );
}
