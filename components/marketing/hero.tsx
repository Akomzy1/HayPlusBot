import Link from "next/link";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { SubscriberCount } from "./subscriber-count";
import { Button } from "@/components/ui/button";

const TRUST = [
  "HFM-authorised strategy provider",
  "Regulated broker partner",
  "Master account runs 24/5",
];

const STATS = [
  { label: "PAIRS", value: "9" },
  { label: "SESSIONS", value: "LDN · NY AM" },
  { label: "AVG SIGNALS / WK", value: "3–7" },
  { label: "STRATEGY", value: "SMC / ICT" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      {/* soft teal glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
        }}
      />
      {/* subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%, black 40%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-24 md:pt-36">
        <div className="max-w-4xl">
          {/* eyebrow badge */}
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Copy-trading strategy &middot; HFM &middot; HFcopy
          </p>

          <h1 className="mt-6 font-sans text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Trade only A+ setups.
            <br />
            <span className="text-muted-foreground">Copy our </span>
            <span className="text-teal">master strategy.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            An AI-driven SMC/ICT strategy running 9 forex pairs across London
            and NY sessions. Subscribe via HFM&rsquo;s HFcopy platform &mdash;
            disciplined, rule-based, transparent.
          </p>

          <div className="mt-8">
            <SubscriberCount />
          </div>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="bg-teal hover:bg-teal/90">
              <Link href="/signup">
                Subscribe on HFcopy
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#performance">
                See live performance
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* trust strip with check icons */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {TRUST.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          {/* 4-stat grid */}
          <dl className="mt-10 grid grid-cols-2 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06] bg-card/40 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {STATS.map((s) => (
              <div key={s.label} className="px-5 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  {s.label}
                </dt>
                <dd className="mt-2 font-mono text-lg text-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
