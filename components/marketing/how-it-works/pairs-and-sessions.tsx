import { CurrencyFlag } from "./flags";
import { Clock } from "lucide-react";

const PAIRS: { code: string; base: string; quote: string }[] = [
  { code: "EUR/USD", base: "EUR", quote: "USD" },
  { code: "GBP/USD", base: "GBP", quote: "USD" },
  { code: "USD/JPY", base: "USD", quote: "JPY" },
  { code: "AUD/USD", base: "AUD", quote: "USD" },
  { code: "USD/CAD", base: "USD", quote: "CAD" },
  { code: "USD/CHF", base: "USD", quote: "CHF" },
  { code: "GBP/JPY", base: "GBP", quote: "JPY" },
  { code: "EUR/JPY", base: "EUR", quote: "JPY" },
  { code: "AUD/JPY", base: "AUD", quote: "JPY" },
];

const SESSIONS = [
  {
    name: "London session",
    window: "07:00 – 10:00 GMT",
    body: "Highest volatility window of the day. Most A+ setups form here as European institutional flows engage with Asian-session ranges.",
  },
  {
    name: "NY AM session",
    window: "12:30 – 15:30 GMT",
    body: "Second peak of liquidity, often producing CHoCH after the London close. NFP and CPI windows fall here; the calendar filter handles them.",
  },
];

export function PairsAndSessions() {
  return (
    <section className="border-b border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Section 04 &middot; Pairs &amp; sessions
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Nine pairs. Two sessions.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Six majors plus three JPY crosses, all liquid enough that slippage
            stays inside our risk model. Outside this list, we don&rsquo;t
            trade &mdash; not exotics, not commodities, not crypto.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {PAIRS.map(({ code, base, quote }) => (
            <li
              key={code}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-card px-4 py-3"
            >
              <span className="flex shrink-0 items-center -space-x-1">
                <span className="relative">
                  <CurrencyFlag code={base} />
                </span>
                <span className="relative">
                  <CurrencyFlag code={quote} />
                </span>
              </span>
              <span className="font-mono text-sm font-medium text-foreground">
                {code}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {SESSIONS.map((s) => (
            <article
              key={s.name}
              className="rounded-xl border border-white/[0.06] bg-card p-6"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal/10 text-teal">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                {s.name}
              </h3>
              <p className="mt-1 font-mono text-sm text-teal">{s.window}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
          We don&rsquo;t trade the Asian session &mdash; price action there
          tends to be range-bound, and SMC setups perform differently. The
          discipline of trading only London and NY AM is deliberate.
        </p>
      </div>
    </section>
  );
}
