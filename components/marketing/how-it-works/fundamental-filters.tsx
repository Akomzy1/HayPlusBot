import { Percent, CalendarClock, DollarSign } from "lucide-react";

const FILTERS = [
  {
    icon: Percent,
    title: "Interest rate differentials",
    body: "We only take longs when the base currency carries a non-negative rate differential against the quote, and shorts when it carries a non-positive one. Trading against the rate gradient is structurally hostile.",
  },
  {
    icon: CalendarClock,
    title: "Economic calendar",
    body: "Thirty minutes before and after any red-folder release on either currency in the pair, no new entries fire. Open positions are managed normally; we just don't add fuel during the volatility spike.",
  },
  {
    icon: DollarSign,
    title: "DXY correlation",
    body: "If the US dollar index is breaking out on the H4, USD pairs that would trade against it are filtered out. (JPY crosses skip this filter since they don't contain USD.)",
  },
];

export function FundamentalFilters() {
  return (
    <section className="border-b border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Section 03 &middot; Fundamental filters
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three context checks before any trade fires.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            A perfect technical setup that fights the macro picture is not an
            A+ setup. Three filters guard against this.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FILTERS.map(({ icon: Icon, title, body }) => (
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
