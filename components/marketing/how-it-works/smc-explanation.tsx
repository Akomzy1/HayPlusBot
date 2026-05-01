/**
 * Static, illustrative SMC chart. Not data-driven — hand-crafted SVG showing
 * the four landmarks the strategy looks for: BOS, liquidity sweep, order
 * block, fair value gap. Subtle grid, brand teal/coral palette.
 */

const TEAL = "#1D9E75";
const TEAL_SOFT = "rgba(29, 158, 117, 0.15)";
const TEAL_BORDER = "rgba(29, 158, 117, 0.5)";
const CORAL = "#D85A30";
const FG = "#F5F6F8";
const MUTED = "#6B7080";

type Candle = {
  x: number;
  bodyTop: number;
  bodyBottom: number;
  high: number;
  low: number;
  bullish: boolean;
};

const CANDLES: Candle[] = [
  { x: 60, bodyTop: 170, bodyBottom: 195, high: 165, low: 200, bullish: false },
  { x: 110, bodyTop: 168, bodyBottom: 182, high: 162, low: 188, bullish: true },
  { x: 160, bodyTop: 158, bodyBottom: 175, high: 152, low: 180, bullish: true },
  { x: 210, bodyTop: 132, bodyBottom: 158, high: 128, low: 162, bullish: true },
  { x: 260, bodyTop: 134, bodyBottom: 152, high: 130, low: 156, bullish: false },
  { x: 310, bodyTop: 144, bodyBottom: 170, high: 140, low: 220, bullish: false },
  { x: 360, bodyTop: 138, bodyBottom: 165, high: 134, low: 170, bullish: true },
  { x: 410, bodyTop: 118, bodyBottom: 138, high: 112, low: 142, bullish: true },
  { x: 460, bodyTop: 90, bodyBottom: 110, high: 85, low: 115, bullish: true },
  { x: 510, bodyTop: 105, bodyBottom: 130, high: 100, low: 135, bullish: false },
  { x: 560, bodyTop: 90, bodyBottom: 118, high: 86, low: 122, bullish: true },
  { x: 610, bodyTop: 58, bodyBottom: 92, high: 52, low: 96, bullish: true },
];

export function SmcExplanation() {
  return (
    <section className="border-b border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
              Section 01 &middot; Smart Money Concepts
            </p>
            <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Read the structure of price &mdash; not signals.
            </h2>
            <p className="mt-5 text-base text-muted-foreground">
              Smart Money Concepts (SMC) and ICT (Inner Circle Trader) describe
              how institutional flows leave fingerprints on the chart: order
              blocks where supply and demand were absorbed, fair value gaps
              left by impulsive moves, and liquidity sweeps where stop orders
              were collected before the real direction.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Our engine identifies these landmarks deterministically, then
              waits for a break of structure (BOS) or change of character
              (CHoCH) to confirm intent before any setup is allowed to score.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {[
                ["Order block", TEAL],
                ["Fair value gap", TEAL],
                ["Liquidity sweep", CORAL],
                ["Break of structure", FG],
              ].map(([label, color]) => (
                <li key={label} className="inline-flex items-center gap-2 pr-4">
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: color as string }}
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-card p-4 sm:p-6">
            <svg
              viewBox="0 0 720 320"
              role="img"
              aria-label="Illustrative chart showing a break of structure, liquidity sweep, order block and fair value gap"
              className="h-auto w-full"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="720" height="320" fill="url(#grid)" />

              {/* FVG zone (between candles 8 and 9) */}
              <rect
                x={395}
                y={112}
                width={90}
                height={20}
                fill={TEAL_SOFT}
                stroke={TEAL_BORDER}
                strokeDasharray="4 3"
                strokeWidth="1"
              />
              <text
                x={500}
                y={117}
                fontSize="10"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fill={TEAL}
                dominantBaseline="middle"
              >
                FVG
              </text>

              {/* Order block (around candle 5) */}
              <rect
                x={245}
                y={132}
                width={30}
                height={22}
                fill="none"
                stroke={TEAL}
                strokeDasharray="3 2"
                strokeWidth="1.4"
                rx="2"
              />
              <text
                x={283}
                y={143}
                fontSize="10"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fill={TEAL}
                dominantBaseline="middle"
              >
                OB
              </text>

              {/* Liquidity sweep marker (around candle 6 long lower wick) */}
              <line
                x1={310}
                y1={235}
                x2={345}
                y2={250}
                stroke={CORAL}
                strokeWidth="1.4"
              />
              <polygon
                points="310,235 318,228 318,242"
                fill={CORAL}
              />
              <text
                x={350}
                y={252}
                fontSize="10"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fill={CORAL}
                dominantBaseline="middle"
              >
                Sweep
              </text>

              {/* BOS line (above candle 4 high, dashed) */}
              <line
                x1={195}
                y1={128}
                x2={695}
                y2={128}
                stroke={FG}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              <text
                x={685}
                y={120}
                fontSize="10"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fill={FG}
                opacity="0.7"
                textAnchor="end"
              >
                BOS
              </text>

              {/* Candles */}
              {CANDLES.map((c, i) => {
                const color = c.bullish ? TEAL : CORAL;
                return (
                  <g key={i}>
                    <line
                      x1={c.x}
                      y1={c.high}
                      x2={c.x}
                      y2={c.low}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <rect
                      x={c.x - 8}
                      y={c.bodyTop}
                      width="16"
                      height={Math.max(2, c.bodyBottom - c.bodyTop)}
                      fill={color}
                    />
                  </g>
                );
              })}

              {/* X axis subtle */}
              <line
                x1={20}
                y1={280}
                x2={700}
                y2={280}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <text
                x={20}
                y={300}
                fontSize="9"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fill={MUTED}
              >
                M15
              </text>
              <text
                x={700}
                y={300}
                fontSize="9"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fill={MUTED}
                textAnchor="end"
              >
                Illustrative &mdash; not live data
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
