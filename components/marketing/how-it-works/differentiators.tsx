import { Target, Eye, Sparkles, BadgeCheck } from "lucide-react";

const ITEMS = [
  {
    icon: Target,
    title: "Discipline",
    body: "3–7 A+ trades per week, not 20. Quality over volume.",
  },
  {
    icon: Eye,
    title: "Transparency",
    body: "Full public performance history — no cherry-picking, no hidden drawdowns.",
  },
  {
    icon: Sparkles,
    title: "Simplicity",
    body: "No bot to configure. No MT5 credentials to manage. No settings to maintain.",
  },
  {
    icon: BadgeCheck,
    title: "Authority",
    body: "Authorised strategy provider on HFM's HFcopy platform.",
  },
];

export function Differentiators() {
  return (
    <section className="border-b border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Section 06 &middot; Why this approach
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What makes the strategy different.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-xl border border-white/[0.06] bg-card p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-teal/10 text-teal">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
