// 4 steps in v3.3 — NOT 5. The previous v3 versions had a 5th step about
// fee mechanics; that's removed per the v3.2 commercial-silence policy.
// Don't add a 5th step in this file.

const STEPS = [
  {
    num: "01",
    title: "Sign up on HayPlusbot",
    body: "Email verification only. Takes 2 minutes.",
  },
  {
    num: "02",
    title: "Sign the risk disclosure",
    body: "Quick acknowledgment of what copy trading involves. Required before accessing performance data or subscribing.",
  },
  {
    num: "03",
    title: "Open an HFM account via our referral link",
    body: "If you don't have one under our IB code already. HFM handles KYC; budget 15–60 minutes depending on their queue.",
  },
  {
    num: "04",
    title: "Subscribe on HFcopy",
    body: "Complete your subscription on HFM's HFcopy platform. From this point, our master account's trades mirror into yours automatically.",
  },
];

export function ParticipationSteps() {
  return (
    <section className="border-b border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Section 05 &middot; How you participate
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Four steps from here to subscribed.
          </h2>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li
              key={s.num}
              className="rounded-xl border border-white/[0.06] bg-card p-6"
            >
              <span className="font-mono text-xs tracking-wider text-teal">
                {s.num}
              </span>
              <h3 className="mt-3 font-sans text-base font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-3xl rounded-lg border border-white/[0.06] bg-secondary/50 px-5 py-4 text-sm text-muted-foreground">
          We don&rsquo;t manage your money. HFM does. Every trade, fee, and
          copy mechanic happens inside their platform.
        </p>
      </div>
    </section>
  );
}
