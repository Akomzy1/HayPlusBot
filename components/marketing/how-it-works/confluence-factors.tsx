import {
  TrendingUp,
  ArrowDownToLine,
  SquareDashed,
  Layers,
  Clock,
  LineChart,
  GitFork,
  type LucideIcon,
} from "lucide-react";

const FACTORS: { num: string; name: string; body: string; icon: LucideIcon }[] = [
  {
    num: "F1",
    name: "HTF bias alignment",
    body: "Daily and 4-hour timeframes must agree on the dominant direction.",
    icon: TrendingUp,
  },
  {
    num: "F2",
    name: "Liquidity sweep present",
    body: "Price has run a recent high or low and reversed before entry.",
    icon: ArrowDownToLine,
  },
  {
    num: "F3",
    name: "Fair value gap identified",
    body: "An unfilled imbalance sits in the path of the proposed move.",
    icon: SquareDashed,
  },
  {
    num: "F4",
    name: "Order block retest",
    body: "Entry overlaps a clean order block from the impulse leg.",
    icon: Layers,
  },
  {
    num: "F5",
    name: "Session alignment",
    body: "The setup forms during London (07:00–10:00) or NY AM (12:30–15:30) GMT.",
    icon: Clock,
  },
  {
    num: "F6",
    name: "Previous day's high/low swept",
    body: "Yesterday's extreme has been cleared, generating fresh liquidity.",
    icon: LineChart,
  },
  {
    num: "F7",
    name: "Structural break confirmation",
    body: "A BOS or CHoCH on the entry timeframe confirms intent.",
    icon: GitFork,
  },
];

export function ConfluenceFactors() {
  return (
    <section className="border-b border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Section 02 &middot; Confluence
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Seven structural factors. Six required.
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTORS.map(({ num, name, body, icon: Icon }) => (
            <li
              key={num}
              className="flex flex-col rounded-xl border border-white/[0.06] bg-card p-5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal/10 text-teal">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
                {num}
              </p>
              <h3 className="mt-1 font-sans text-base font-semibold text-foreground">
                {name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
          An A+ setup requires at least 6 of 7 confluence factors to pass.
          This deliberately limits trades to the highest-conviction
          opportunities. Beyond these structural factors, three fundamental
          filters must also pass.
        </p>
      </div>
    </section>
  );
}
