export function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-32 md:pb-20 md:pt-36">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
          Methodology
        </p>
        <h1 className="mt-6 font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          How HayPlusbot trades.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Smart Money Concepts and ICT methodology, applied with discipline:
          structure-first analysis, fundamental filters, and only the highest-
          conviction setups across 9 pairs and two sessions. No discretion,
          no overrides &mdash; the same rules every time.
        </p>
      </div>
    </section>
  );
}
