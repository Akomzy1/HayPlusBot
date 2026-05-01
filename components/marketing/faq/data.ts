// FAQ content for /faq.
//
// v3.3 commercial-silence policy applies: no fee percentages, no "40/60" or
// "performance fee" mentions. Q8, Q17, Q18 contain the exact wording mandated
// by the build prompt — do not paraphrase those.

export type FaqCategoryId =
  | "basics"
  | "subscribing"
  | "performance"
  | "fees"
  | "technical";

export const FAQ_CATEGORIES: { id: FaqCategoryId; name: string }[] = [
  { id: "basics", name: "The Basics" },
  { id: "subscribing", name: "Subscribing" },
  { id: "performance", name: "Performance & Risk" },
  { id: "fees", name: "Subscription & Fees" },
  { id: "technical", name: "Technical" },
];

export type FaqQuestion = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export const FAQ_QUESTIONS: FaqQuestion[] = [
  // --- The Basics --------------------------------------------------------
  {
    id: "question-1",
    category: "basics",
    question: "What exactly is HayPlusbot?",
    answer:
      "HayPlusbot is an authorised strategy provider on HFM's HFcopy platform. We run a single master trading account using a deterministic Smart Money Concepts (SMC) and ICT methodology across 9 forex pairs. When you subscribe via HFcopy, the master account's trades mirror automatically into yours.",
  },
  {
    id: "question-2",
    category: "basics",
    question: "Is this a bot I run on my computer?",
    answer:
      "No. HayPlusbot is a copy-trading service, not software you install. There is nothing to configure, no MT5 credentials to provide, and no settings to maintain on your end. Our master account runs the strategy; HFM's HFcopy infrastructure mirrors the trades into your HFM account.",
  },
  {
    id: "question-3",
    category: "basics",
    question: "What's HFcopy?",
    answer:
      "HFcopy is HFM's official copy-trading platform. Strategy providers (like us) trade their own master account, and subscribers can replicate those trades into their own HFM account in real time. HFM administers the entire mechanism — risk controls, copy ratios, fee collection — through their interface.",
  },
  {
    id: "question-4",
    category: "basics",
    question: "Do I need MT5 experience?",
    answer:
      "No MT5 expertise required. You need an HFM account (standard KYC) and a basic understanding that you're copying a trading strategy with real capital at risk. HFM's interface walks you through copy configuration — copy ratio, leverage limits, and so on — when you subscribe.",
  },
  {
    id: "question-5",
    category: "basics",
    question: "What does a typical trading week look like?",
    answer:
      "Expect 3–7 A+ signals per week across all 9 pairs combined. Trades only fire during the London session (07:00–10:00 GMT) and NY AM session (12:30–15:30 GMT). Weeks with red-folder economic events or DXY breakouts may produce fewer signals — that's the calendar and correlation filters doing their job.",
  },

  // --- Subscribing -------------------------------------------------------
  {
    id: "question-6",
    category: "subscribing",
    question: "Do I have to use your referral link?",
    answer:
      "Yes. HayPlusbot's HFcopy subscription requires your HFM account to be registered under our IB referral code. This is how the partnership works on HFM's side. The referral link is on our signup flow; using it costs you nothing extra.",
  },
  {
    id: "question-7",
    category: "subscribing",
    question: "What if I already have an HFM account?",
    answer:
      "If your existing HFM account isn't already under our IB code, you'll need to open a new one via our referral link to subscribe to HayPlusbot's strategy. This is a constraint imposed by HFM's IB tracking, not by us.",
  },
  {
    id: "question-8",
    category: "subscribing",
    question: "What's the minimum deposit?",
    answer:
      "We recommend at least $100 USD equivalent in your HFM account before subscribing. This is the minimum that produces meaningful copy-trading results — below this, HFM may skip smaller trades or produce positions too small to be useful. HFM also sets its own minimum deposit requirements which their platform displays during the HFcopy subscription process. Both must be met to start copying our strategy.",
  },
  {
    id: "question-9",
    category: "subscribing",
    question: "How long does setup take?",
    answer:
      "Typically 30–60 minutes from signup on HayPlusbot to active subscription on HFcopy. The slowest step is usually HFM's KYC verification, which is outside our control. If your KYC is already complete on a previous HFM account, the new account opens faster.",
  },
  {
    id: "question-10",
    category: "subscribing",
    question: "Can I use a different broker?",
    answer:
      "Not currently. We're HFM-exclusive at launch because HFcopy is where our master account operates. If we expand to other brokers later, subscribers would need to move to that broker's account for the new strategy stream.",
  },
  {
    id: "question-11",
    category: "subscribing",
    question: "How do I unsubscribe?",
    answer:
      "Unsubscribe directly inside HFM's HFcopy interface. The subscription mechanic is administered by HFM, so cancellation goes through them. There's nothing to cancel on HayPlusbot's side — we don't charge you directly.",
  },

  // --- Performance & Risk ------------------------------------------------
  {
    id: "question-12",
    category: "performance",
    question: "How can I see live performance?",
    answer:
      "After signing the risk disclosure, your authenticated dashboard at /dashboard shows the master account's equity curve, signal history, and aggregate stats. The public homepage shows a 90-day teaser of the same data. Open positions appear with a 60-second delay (anti-front-running); closed trades appear immediately.",
  },
  {
    id: "question-13",
    category: "performance",
    question: "Can I lose money?",
    answer:
      "Yes. Copy trading involves real risk — you can lose some or all of the capital in your HFM account. Past performance doesn't guarantee future results. Trade only with money you can afford to lose. Read our risk disclosure in full before subscribing.",
  },
  {
    id: "question-14",
    category: "performance",
    question: "What's your historical win rate?",
    answer:
      "We publish full historical performance — wins, losses, drawdowns — without cherry-picking. The /dashboard equity curve and signals archive are the source of truth. We deliberately don't headline a single win-rate number because it depends entirely on the time window; look at the curve, the max drawdown, and the streak distribution.",
  },
  {
    id: "question-15",
    category: "performance",
    question: "How is the strategy tested?",
    answer:
      "The SMC/ICT engine is deterministic — same inputs always produce the same outputs. We run continuous backtests against historical data and walk-forward tests to guard against overfitting. The methodology itself is documented in our SKILL.md and doesn't change without explicit product approval.",
  },
  {
    id: "question-16",
    category: "performance",
    question: "What happens during volatile markets?",
    answer:
      "The economic calendar filter blocks new trades for 30 minutes before and after red-folder events on either currency in a pair. Liquidity sweep detection is part of why volatile sessions can still produce A+ setups (sweeps generate the very fingerprints we look for). Circuit breakers pause the master account after consecutive losses.",
  },

  // --- Subscription & Fees ----------------------------------------------
  {
    id: "question-17",
    category: "fees",
    question: "How does HayPlusbot make money?",
    answer:
      "HayPlusbot operates as an authorised strategy provider on HFM's HFcopy platform. Fee structure and commercial arrangements are administered by HFM through their subscription interface. When you subscribe, HFM's platform shows you exactly what you'll be charged and when. HayPlusbot does not charge you directly.",
  },
  {
    id: "question-18",
    category: "fees",
    question: "When does the fee apply?",
    answer:
      "Fees are calculated and collected by HFM on trades that close in profit. See your subscription details on HFM's HFcopy platform for the exact timing and mechanics.",
  },
  {
    id: "question-19",
    category: "fees",
    question: "What if the strategy has a losing week or month?",
    answer:
      "Losing weeks and months happen — they're built into the historical drawdowns visible on the equity curve. The strategy's risk model is designed to keep individual losses small and circuit breakers pause the master after consecutive losses. Stay subscribed only if you're comfortable with the drawdown profile we publish.",
  },
  {
    id: "question-20",
    category: "fees",
    question: "Can I pause my subscription?",
    answer:
      "Yes. HFM's HFcopy interface lets you pause and resume subscriptions at any time. While paused, your account doesn't mirror new trades from the master. Resume whenever you're ready. There's no friction or penalty on pausing.",
  },

  // --- Technical ---------------------------------------------------------
  {
    id: "question-21",
    category: "technical",
    question: "Which pairs do you trade?",
    answer:
      "Nine pairs in total: the six majors (EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF) and three JPY crosses (GBP/JPY, EUR/JPY, AUD/JPY). No exotics, no commodities, no crypto. The pair list is fixed by design — adding a new pair requires explicit product approval and an architectural change.",
  },
  {
    id: "question-22",
    category: "technical",
    question: "What times do you trade?",
    answer:
      "London session (07:00–10:00 GMT) and NY AM session (12:30–15:30 GMT). Outside these windows no new entries fire — existing positions are managed normally. We don't trade the Asian session because price action there tends to be range-bound and our SMC setups perform differently.",
  },
  {
    id: "question-23",
    category: "technical",
    question: "What if HFM has an outage?",
    answer:
      "If HFM's platform is unavailable, the master account can't fire new trades and HFcopy mirroring pauses for everyone. Open positions on HFM's side continue to be managed by their normal infrastructure. Trades resume once HFM's connection is restored. We don't trade through outages.",
  },
  {
    id: "question-24",
    category: "technical",
    question: "Is there a mobile app?",
    answer:
      "There's no native HayPlusbot app. The website is fully mobile-responsive — you can sign up, view performance, and read signals on any phone. For account management (deposits, withdrawals, copy settings, pausing), use HFM's official mobile app, which works for HFcopy subscribers like you'd expect.",
  },
];
