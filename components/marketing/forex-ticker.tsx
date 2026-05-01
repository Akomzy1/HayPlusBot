/**
 * Horizontal scrolling FX ticker. Decorative — populated with sample
 * snapshot prices for now; can be wired to Finnhub or Trading Economics
 * later (the table list `news_headlines` already exists for that pipeline).
 *
 * Animation is a CSS keyframe translateX over a duplicated track so the
 * loop is seamless. Hovering pauses the scroll. Honors prefers-reduced-
 * motion via the `motion-reduce:` Tailwind variant + animation-name being
 * suppressed below.
 */

const PAIRS: { symbol: string; price: string; change: number }[] = [
  { symbol: "XAU/USD", price: "2384.91", change: 0.62 },
  { symbol: "EUR/GBP", price: "0.86257", change: 0.07 },
  { symbol: "USD/ZAR", price: "18.4217", change: -0.22 },
  { symbol: "USD/NGN", price: "1562.40", change: 0.09 },
  { symbol: "EUR/USD", price: "1.08940", change: 0.12 },
  { symbol: "USD/JPY", price: "154.217", change: 0.34 },
  { symbol: "GBP/USD", price: "1.26431", change: -0.08 },
  { symbol: "AUD/USD", price: "0.65789", change: 0.21 },
  { symbol: "USD/CAD", price: "1.37214", change: -0.05 },
  { symbol: "USD/CHF", price: "0.90572", change: 0.13 },
  { symbol: "GBP/JPY", price: "194.876", change: 0.41 },
  { symbol: "EUR/JPY", price: "168.034", change: 0.28 },
];

function Pair({ symbol, price, change }: (typeof PAIRS)[number]) {
  const positive = change >= 0;
  return (
    <span className="inline-flex items-center gap-2.5 px-6 font-mono text-sm">
      <span className="text-muted-foreground">{symbol}</span>
      <span className="text-foreground">{price}</span>
      <span className={positive ? "text-teal" : "text-coral"}>
        {positive ? "+" : ""}
        {change.toFixed(2)}%
      </span>
    </span>
  );
}

export function ForexTicker() {
  return (
    <section
      aria-label="Live forex prices"
      className="relative overflow-hidden border-y border-white/[0.06] bg-background py-3"
    >
      <div className="group flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none">
        {[0, 1].map((track) => (
          <div
            key={track}
            aria-hidden={track === 1 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            {PAIRS.map((p, i) => (
              <Pair key={`${track}-${p.symbol}-${i}`} {...p} />
            ))}
          </div>
        ))}
      </div>
      {/* fade-out edges so it disappears at the boundaries */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent"
      />
    </section>
  );
}
