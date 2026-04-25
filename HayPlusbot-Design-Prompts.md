# HayPlusbot — Design Prompts Library (v3.3)

**The complete, current, ready-to-use library of design prompts for generating HayPlusbot's visual prototypes.**

This document replaces all earlier design-prompt documents. Use only this one.

---

## How to use this document

Every prototype you need to generate has a dedicated section below. Each section contains a complete, ready-to-paste prompt for claude.ai with Claude Opus 4.7.

**Workflow per prototype:**

1. Open a fresh claude.ai chat. Select Claude Opus 4.7 in the model dropdown.
2. Copy the entire prompt block (everything between the two `=====` markers) for the prototype you're building.
3. Paste into the chat. Send.
4. Claude produces the artifact. Iterate on visual details — typically 3-6 rounds for complex prototypes.
5. When happy, click Export → Standalone HTML.
6. Save the file to your `prototypes/` folder with the specified filename.
7. Git commit.

**Each prompt is self-contained.** Project context, design system, product facts are all embedded. You don't paste anything else with them.

---

## The 13 prototypes to build

For v3.2, you need 13 prototypes. Sequence suggestion (from easy-to-understand to complex):

| Order | Prototype | File | Difficulty | Notes |
|-------|-----------|------|-----------|-------|
| 1 | p0 Design system reference | p0-design-system.html | Easy | Foundation, build first |
| 2 | p8 Signal card | p8-signal-card.html | Easy | Reusable component |
| 3 | p9 Fundamental bias panel | p9-fundamental-bias.html | Easy | Static widget |
| 4 | p7 Chart component | p7-chart-component.html | Medium | Recharts-based |
| 5 | p10 Performance analytics | p10-performance-analytics.html | Medium | Multi-chart layout |
| 6 | p11 Settings | p11-settings.html | Easy | Simple forms |
| 7 | p1 Landing page | p1-landing.html | Medium | Primary conversion surface |
| 8 | p3 FAQ | p3-faq.html | Easy | Accordion content |
| 9 | p4 How it works | p4-how-it-works.html | Medium | Content-heavy explainer |
| 10 | p5 Onboarding flow | p5-onboarding-flow.html | Medium | 4-step multi-screen |
| 11 | p13 Risk disclosure | p13-risk-disclosure.html | Hard | Long-form legal content |
| 12 | p6 Dashboard | p6-dashboard.html | Hard | Complex authenticated surface |
| 13 | p16 Admin dashboard | p16-admin-dashboard.html | Hardest | Multi-section admin surface |
| 14 | p17 Subscribe flow | p17-subscribe-flow.html | Medium | Critical conversion step |
| 15 | p18 Signal archive | p18-signal-archive.html | Medium | Browsing and filtering |

Actually 15 files counting p17 and p18 which are new in v3. p2 (how-we-make-money) and p12, p14, p15 from older versions are intentionally excluded — v3 doesn't have those.

---

## The Shared Project Context (used in every prompt)

This context block is embedded at the top of each prompt below. You don't paste it separately — it's already inside each prompt.

For reference only, here is what's embedded:

- Project definition: managed copy-trading strategy on HFM's HFcopy platform
- Target users: retail forex traders globally, Nigeria primary market
- Brand aesthetic: Bloomberg Terminal × Linear × Stripe, dark-mode-first
- Design tokens: colours, typography, spacing, radius, motion
- Settled product facts: 9 pairs, London + NY sessions, free signup, email-only verification, disclosure-gated content, mandatory IB referral, Telegram floating button, 60-second position delay
- Commercial-silence policy: no fee percentages on marketing surfaces, fees handled by HFM at subscription

---

## Prompt 0 — Design system reference

Save as: `prototypes/p0-design-system.html`

**Purpose:** a comprehensive style guide showing every design element in one place. Used as visual reference for all other prototypes. Build this first.

=====

# HayPlusbot Design System Reference

## Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. Single master HFM trading account runs an AI-driven SMC/ICT A+ setup engine. Subscribers mirror trades via HFM's HFcopy infrastructure. Free signup, no HayPlusbot-side fees.

Target users: retail forex traders in Nigeria (primary), UK/EU, global English-speaking markets.

## Brand aesthetic

Reference mood: Bloomberg Terminal × Linear.app × Stripe Dashboard. Professional trading terminal energy. Dark-mode-first. Information-dense but uncluttered. Precise typography. Subtle micro-interactions. No emoji. No stock photography.

## Design tokens

Colour palette:
- Background base: #0A0B0F (near-black deep navy)
- Surface: #12141B
- Surface elevated: #1A1D26
- Border subtle: rgba(255,255,255,0.06)
- Border default: rgba(255,255,255,0.10)
- Text primary: #F5F6F8
- Text secondary: #A4A9B8
- Text tertiary: #6B7080
- Teal (positive/bullish): #1D9E75
- Teal soft: rgba(29, 158, 117, 0.12)
- Coral (negative/risk): #D85A30
- Coral soft: rgba(216, 90, 48, 0.12)
- Amber (caution): #BA7517
- Amber soft: rgba(186, 117, 23, 0.12)

Typography:
- UI and display: Outfit (400, 500, 600). Tight letter-spacing -0.02em on display sizes.
- Numeric/monospace: JetBrains Mono (400, 500). Always used for prices, P/L, lot sizes, R:R, timestamps.
- Type scale: 12, 13, 14, 16, 20, 24, 32, 48px. No other sizes.

Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96px.
Radius: 6px (buttons, badges), 8px (inputs, small cards), 12px (medium cards), 16px (dialogs, large panels).
Shadows: avoid drop shadows on dark backgrounds; use border + background elevation.
Motion: ease-out 200ms on hover, ease-in-out 300ms on layout shifts, spring on modals. No bouncy animations.

## Build task

Build a single React artifact that serves as a visual style guide. It should show every element a designer or developer could need to reference. Users will view this once to get oriented, then other prototypes will follow these patterns.

Sections:

1. Typography showcase: all 8 sizes shown with Outfit + one JetBrains Mono sample (e.g., "$1,247.82"). Show weights 400, 500, 600 for Outfit.

2. Colour palette: each colour as a 120px × 80px swatch with its hex code below in JetBrains Mono 12px. Group teal/coral/amber with their soft variants.

3. Buttons: primary (teal), secondary (ghost with border), destructive (coral), tertiary (text-only). Three sizes: sm (32px tall), default (40px), lg (48px). Show normal, hover, active, disabled states.

4. Form elements: text input, number input (mono), select dropdown, checkbox, radio, toggle switch, search input with icon. Show focused and error states.

5. Cards: surface, surface-elevated, with and without borders. Different padding examples.

6. Badges: default, success (teal), error (coral), warning (amber), info. Rounded rectangles and pill shapes (only for status).

7. Alerts: success, error, warning, info. With icons.

8. Numeric display: show "1,247.82", "+$234.50", "-$87.30", "1.0842", "+45 pips", "-23 pips" demonstrating colour-coded positive/negative with JetBrains Mono.

9. Icons: lucide-react icons showing common ones used (TrendingUp, TrendingDown, BarChart2, Activity, Zap, Lock, Calendar, Bell, Settings).

10. Motion demo: a small button that scales slightly on hover (200ms ease-out), a card that lifts subtly on hover.

Layout: single long scrollable page, each section clearly labelled with H2 headings, generous spacing between sections.

Output: single React artifact using Tailwind CSS. Use lucide-react for icons. No external images — everything SVG or CSS-generated.

=====

---

## Prompt 1 — Landing page

Save as: `prototypes/p1-landing.html`

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. A single master HFM trading account runs an AI-driven SMC/ICT A+ setup engine, executing trades during London and NY AM sessions across 9 forex pairs. Subscribers on HFM mirror the master's trades via HFM's HFcopy infrastructure. Users do not run a bot themselves.

Target: retail forex traders in Nigeria (primary), UK/EU, global English-speaking markets. Free signup. Revenue is handled entirely through HFM's platform — marketing surfaces are commercial-silent (no fee percentages or commercial mechanics mentioned on HayPlusbot pages).

## Brand aesthetic

Bloomberg Terminal × Linear.app × Stripe Dashboard. Dark-mode-first. Information-dense. Precise typography. No emoji. No stock photography. Professional trading terminal energy, not consumer fintech.

## Design tokens

Colours:
- Background: #0A0B0F, surface #12141B, surface elevated #1A1D26
- Border: rgba(255,255,255,0.06) subtle, rgba(255,255,255,0.10) default
- Text: #F5F6F8 primary, #A4A9B8 secondary, #6B7080 tertiary
- Teal (positive): #1D9E75, teal soft rgba(29,158,117,0.12)
- Coral (negative): #D85A30, coral soft rgba(216,90,48,0.12)
- Amber (caution): #BA7517, amber soft rgba(186,117,23,0.12)

Typography:
- Outfit 400/500/600 for UI
- JetBrains Mono 400/500 for all numbers
- Scale: 12, 13, 14, 16, 20, 24, 32, 48px only

Spacing: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96px
Radius: 6px buttons, 8px inputs/small cards, 12px medium cards, 16px large panels
Motion: 200ms ease-out hover, 300ms ease-in-out layout, no bouncy animations

## Build task

Build the HayPlusbot landing page as a single self-contained React artifact using Tailwind CSS.

The hero must prominently communicate: this is a copy-trading strategy service. "Subscribe to our master strategy on HFM" is the primary CTA. Users do not run anything themselves.

Sections in order:

**Top navigation**
- HayPlusbot logo on the left (geometric SVG design you create inline)
- Links: "How it works", "FAQ", "Sign in"
- Primary CTA button (teal): "Get started"
- Nav stays fixed on scroll with subtle background when scrolled

**Hero**
- H1 (Outfit 48px, weight 600, tight letter-spacing): "Trade only A+ setups. Copy our master strategy."
- Subheadline (Outfit 20px, secondary colour): "An AI-driven SMC/ICT strategy running 9 forex pairs across London and NY sessions. Subscribe via HFM's HFcopy platform — disciplined, rule-based, transparent."
- Subscriber count widget: small card below subheadline showing "247 traders copying HayPlusbot" with a small teal pulsing dot. (For prototype, show with 247. In production, hidden if count under 50.)
- Two CTAs side by side: "Subscribe on HFcopy →" (primary teal, large) and "See live performance ↓" (ghost button, scroll to performance section)
- Trust strip below CTAs: small horizontal row with three items — "HFM-authorised strategy provider", "Regulated broker partner", "Master account runs 24/5"

**Live performance teaser**
- Small section with compact 90-day equity curve (teal line on subtle teal-soft area fill, using recharts)
- Three stats below the chart: Total pips (mono, large), Win rate (mono, with percentage), Active subscribers (mono)
- Link: "View full performance →" (for logged-in subscribers)

**How it works (3 cards)**
Section heading: "How it works"
Three cards in a row (stack on mobile):
1. "Open an HFM account" — numbered "01", body: "Open an HFM account through our referral link. Required for copy trading to work."
2. "Sign the risk disclosure" — numbered "02", body: "Quick acknowledgment of what copy trading involves. Takes 5 minutes."
3. "Subscribe on HFcopy" — numbered "03", body: "Complete your subscription on HFM's platform. Trades mirror automatically from that point."

**What our strategy does (3 feature tiles)**
Section heading: "What our strategy does"
Three feature tiles:
1. "Smart Money Concepts" — icon (TrendingUp), body: "Structural analysis of liquidity pools and institutional order flow across multiple timeframes."
2. "Fundamental filters" — icon (BarChart2), body: "Interest rate differentials, economic calendar, and DXY correlation filter every potential setup."
3. "Disciplined execution" — icon (Zap), body: "3-7 A+ signals per week. London and NY AM sessions only. Circuit breakers prevent overtrading."

**What makes this simple (three cards)**
Section heading: "What makes this simple"
Subheading (secondary): "Fewer things to think about."
Three cards:
1. "No charge on losses" — body: "Fee is only assessed on trades that close green"
2. "No monthly subscription" — body: "No card on file. No upfront. No cancellation friction."
3. "Administered by HFM" — body: "Stop or pause the subscription from inside HFM at any time"

**Recent signal examples (2-3 signal cards)**
Section heading: "Recent A+ signals"
Subheading: "Real signals from our master account, with the reasoning."
Two or three horizontal signal cards showing:
- Timestamp (mono), pair and direction (e.g., "EUR/USD · LONG")
- Entry, SL, TP prices (mono)
- Confluence score pill ("6/7 confluence passed")
- 2-3 sentence narrative explaining the setup
- Outcome badge (Winner/Loser with pips, or "Still open")

**FAQ accordion (4 key questions)**
Section heading: "Common questions"
Four questions in accordion format:
1. "Can I lose money?"
2. "Do I need to know about forex?"
3. "Which brokers do you work with?"
4. "How do I subscribe?"
Each answer is 2-3 sentences. Refer users to the full FAQ page for more.

**Risk disclosure callout**
Amber-soft alert card: "Subscribing to copy-trading strategies involves real capital at real risk. Past performance does not guarantee future results." with link "Read our risk disclosure →"

**Footer**
- HayPlusbot logo
- Links: How it works · FAQ · Risk disclosure · Terms · Privacy
- Small text: "HayPlusbot is an authorised strategy provider on HFM's HFcopy platform. HayPlusbot Nigeria, Lagos."
- Social links: Telegram only (no other socials)

**Floating Telegram button (fixed bottom-right)**
- 56px circular teal button, 24px from edges
- Telegram/Send icon centred
- Drop shadow: 0 4px 12px rgba(29, 158, 117, 0.3)
- On hover: scale 1.05, smooth 200ms ease-out
- Tooltip on hover: "Join our Telegram channel" (left of button)
- aria-label: "Open HayPlusbot Telegram channel in new tab"
- Below 480px: shrinks to 48px, moves to 16px from edges
- Initial entrance: scale-up animation after 2-second page load delay
- Reads URL from window variable or prop — for prototype use "https://t.me/hayplusbot" placeholder

## Constraints

- Dark mode only
- Mobile responsive (minimum 360px width)
- All numbers in JetBrains Mono
- No emoji
- No mention of fee percentages, "40%", "60%", "40/60 split", or specific commercial terms anywhere on the page
- Use recharts for the equity curve
- Use lucide-react for icons
- Accessible contrast (WCAG AA)
- Semantic HTML with proper heading hierarchy

SEO metadata to include at top as a reference block:
- Meta title: "HayPlusbot — AI Forex Copy-Trading Strategy on HFM's HFcopy"
- Meta description (155 chars): "Subscribe to an authorised HFM copy-trading strategy. SMC/ICT A+ setups across 9 pairs. Free signup. Transparent performance. Trade only what qualifies."
- JSON-LD Service schema (not Product since we're not selling a product)

Output: single React artifact using Tailwind CSS, lucide-react for icons, recharts for the chart.

=====

---

## Prompt 3 — FAQ page

Save as: `prototypes/p3-faq.html`

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. Free signup. Single master HFM account runs an AI SMC/ICT strategy; subscribers mirror trades via HFM's HFcopy. Users don't run bots themselves.

Target users: retail forex traders in Nigeria (primary), UK/EU, global English-speaking markets.

Commercial arrangements are administered by HFM at the point of subscription. Marketing surfaces on HayPlusbot do not detail fee percentages or specific commercial mechanics — those are HFM's to display at subscription time.

## Brand aesthetic

Bloomberg Terminal × Linear.app × Stripe Dashboard. Dark-mode-first. Information-dense but uncluttered. No emoji. No stock photography.

## Design tokens

Background #0A0B0F, surface #12141B, surface-elevated #1A1D26. Teal #1D9E75 positive, coral #D85A30 negative, amber #BA7517 caution. Text #F5F6F8 primary, #A4A9B8 secondary, #6B7080 tertiary. Outfit for UI, JetBrains Mono for numbers.

## Build task

Build the HayPlusbot FAQ page as a single React artifact with Tailwind CSS.

Layout:

**Top navigation** — same as landing page (HayPlusbot logo, links to How it works / FAQ / Sign in, primary "Get started" CTA).

**Hero**
- H1: "Common questions"
- Subhead: "Everything you need to understand before subscribing."
- Search input (placeholder: "Search questions...") — functional filter if possible

**Category tabs** (horizontal)
- The Basics
- Subscribing
- Performance & Risk
- Subscription & Fees
- Technical

**FAQ content in accordion format** organised by category:

### The Basics (5 questions)

1. **What exactly is HayPlusbot?**
Answer: "HayPlusbot is an authorised strategy provider on HFM's HFcopy platform. We operate a master trading account that runs an AI-driven SMC/ICT strategy across 9 forex pairs. When you subscribe to our strategy on HFcopy, HFM automatically mirrors our master account's trades into yours."

2. **Is this a bot I run on my computer?**
Answer: "No. HayPlusbot runs entirely on our master HFM account. You don't install anything, don't run any software, don't provide any MT5 credentials. You just subscribe to the strategy through HFM's HFcopy interface and your account mirrors our trades automatically."

3. **What's HFcopy?**
Answer: "HFcopy is HFM's built-in copy-trading platform. Strategy providers (like us) run trading accounts, and subscribers can opt to have those trades mirrored into their own accounts. HFM handles all the mechanics of mirroring, account management, and fee collection within their platform."

4. **Do I need MT5 experience?**
Answer: "No MT5 expertise required. You need an HFM account — standard KYC — and a basic understanding that you're copying a trading strategy with real risk. HFM's interface walks you through copy configuration (copy ratio, leverage limits, etc.) when you subscribe."

5. **What does a typical trading week look like?**
Answer: "Expect 3-7 A+ signals per week across our 9 forex pairs. Some weeks are quieter (2-3 signals), some busier (6-7). The strategy waits for qualifying setups rather than forcing trades — a disciplined approach means fewer, higher-quality trades rather than high-frequency activity."

### Subscribing (6 questions)

6. **Do I have to use your referral link?**
Answer: "Yes. To subscribe to our HFcopy strategy, your HFM account must be registered under our IB partner code. This is a requirement of our commercial arrangement with HFM. If you already have an HFM account under a different code, you'll need to open a new HFM account using our referral link to subscribe."

7. **What if I already have an HFM account?**
Answer: "If your existing HFM account isn't under our IB partner code, you cannot use it to subscribe to our strategy. You'd need to open a new HFM account via our referral link. The existing account remains yours for other purposes, but for HayPlusbot subscription, the new account under our code is required."

8. **What's the minimum deposit?**
Answer: "HFM sets its own minimum deposit requirements for HFcopy subscriptions. Their platform will show you the exact minimum during the subscription process. HayPlusbot doesn't enforce a separate minimum — if HFM's threshold is met, you can subscribe."

9. **How long does setup take?**
Answer: "From signup on HayPlusbot to active subscription: typically 30-60 minutes, depending on how quickly HFM completes your account KYC. The slowest part is usually HFM's verification process, which is outside our control."

10. **Can I use a different broker?**
Answer: "Not currently. We're HFM-exclusive at launch because HFcopy is where our strategy operates. In the future we may expand to other brokers, but subscribers would need to move to the new broker for that expansion."

11. **How do I unsubscribe?**
Answer: "Unsubscribe anytime through HFM's HFcopy interface. It's instant and doesn't require contacting us. Your HFM account remains open — only the strategy subscription stops."

### Performance & Risk (5 questions)

12. **How can I see live performance?**
Answer: "Once you sign in and acknowledge the risk disclosure, your dashboard shows the master account's live equity curve, recent trades, and performance stats. Open positions are shown with a 60-second delay to prevent front-running. Closed trades appear immediately."

13. **Can I lose money?**
Answer: "Yes. Copy trading involves real risk — you can lose some or all of your capital. Past performance doesn't guarantee future results. Trade only with money you can afford to lose. Review our risk disclosure for the full picture before subscribing."

14. **What's your historical win rate?**
Answer: "Our dashboard (authenticated access) shows the master account's actual win rate, total pips, drawdowns, and monthly breakdown. We don't publish specific percentages in marketing because market conditions change — the live data is the honest source."

15. **How is the strategy tested?**
Answer: "Our strategy uses a deterministic rule-based engine — 7 confluence factors plus 3 fundamental filters. The logic is tested against historical market data before deployment. Live trades are logged in full detail (every candle evaluated, every factor scored) so any outcome can be audited."

16. **What happens during volatile markets?**
Answer: "Circuit breakers pause trading after 2 consecutive losses, 3 daily losses, or daily/weekly A+ limits (2/day, 5/week). Economic calendar events close trading 1 hour before and after red-folder events. The strategy's built to wait through volatility rather than trade through it."

### Subscription & Fees (4 questions)

17. **How does HayPlusbot make money?**
Answer: "HayPlusbot operates as an authorised strategy provider on HFM's HFcopy platform. Fee structure and commercial arrangements are administered by HFM through their subscription interface. When you subscribe, HFM's platform shows you exactly what you'll be charged and when. HayPlusbot does not charge you directly."

18. **When does the fee apply?**
Answer: "Fees are calculated and collected by HFM on trades that close in profit. See your subscription details on HFM's HFcopy platform for the exact timing and mechanics."

19. **What if the strategy has a losing week or month?**
Answer: "Losing periods happen to every strategy, including ours. Past performance does not guarantee future results. Review our public performance history on the dashboard (once authenticated) to understand how the strategy has handled different market conditions. Subscribers can unsubscribe at any time through HFM's platform."

20. **Can I pause my subscription?**
Answer: "Yes. HFM's HFcopy interface lets you pause or stop the subscription at any time. Pausing means no new trades are mirrored into your account while the pause is active; existing positions continue per HFM's rules. Resume through the same interface."

### Technical (4 questions)

21. **Which pairs do you trade?**
Answer: "Nine forex pairs: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, GBP/JPY, EUR/JPY, AUD/JPY. Six majors plus three JPY crosses. No indices, no commodities, no exotics."

22. **What times do you trade?**
Answer: "Two sessions only — London 07:00-10:00 GMT and NY AM 12:30-15:30 GMT. We don't trade the Asian session because it's typically range-bound and SMC setups perform differently. Trading windows are strict; no exceptions."

23. **What if HFM has an outage?**
Answer: "If HFM's platform has issues, any open trades at the master account follow HFM's rules for such events. The strategy cannot execute new trades during an outage. We monitor HFM's status closely and communicate with subscribers about any meaningful disruption."

24. **Is there a mobile app?**
Answer: "HayPlusbot.com is a mobile-responsive web app — it works on phone browsers. There's no native iOS or Android app. HFM has its own native apps (MetaTrader 5, HFcopy apps) that you'd use for account management on your phone."

**Still have questions?** callout
At the bottom: "Can't find your answer? Email us at hello@hayplusbot.com. We respond within 72 hours."

**Footer** — same as landing page.

## Constraints

- Dark mode, mobile responsive
- JetBrains Mono for any numbers
- Accordion behaviour: clicking question expands answer; multiple can be open at once
- Accessible: ARIA expanded states, keyboard navigable
- No mention of fee percentages ("40%", "60%", etc.) anywhere
- JSON-LD FAQPage schema with all 24 Q&A pairs

Output: single React artifact using Tailwind CSS and lucide-react for icons.

=====

---

## Prompt 4 — How it works page

Save as: `prototypes/p4-how-it-works.html`

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. A master HFM account runs an AI-driven SMC/ICT strategy across 9 forex pairs during London and NY AM sessions. Subscribers mirror trades via HFM. Free signup. Commercial arrangements are handled at HFM's subscription interface, not described in detail on our site.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first. Information-dense, precise, professional. No emoji. No stock photography.

## Design tokens

Background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75 positive, coral #D85A30 negative. Text #F5F6F8 primary, #A4A9B8 secondary, #6B7080 tertiary. Outfit for UI, JetBrains Mono for numbers. Type scale: 12, 13, 14, 16, 20, 24, 32, 48px only.

## Build task

Build the HayPlusbot "How it works" page as a single React artifact.

Layout:

**Top navigation** — consistent with landing page.

**Hero**
- H1: "How HayPlusbot works"
- Subhead: "An honest explanation of our strategy, our mechanism, and what you actually get when you subscribe."

**Section 1 — Smart Money Concepts: the analysis layer**
- H2: "The analysis layer — Smart Money Concepts"
- Body paragraph explaining SMC as a methodology focused on institutional order flow, liquidity pools, and structural market behaviour across multiple timeframes.
- Illustrative chart (SVG, you create inline): a price chart with annotations showing order blocks (teal rectangles), fair value gaps (teal-soft rectangles), liquidity sweeps (arrows), break of structure points (labels).
- Body: "Our engine analyses M15, H1, H4, and D1 timeframes simultaneously to identify where institutional order flow is likely to create high-probability setups."

**Section 2 — The A+ setup: 7 confluence factors**
- H2: "The A+ setup — 7 confluence factors"
- Body intro: "An A+ setup requires at least 6 of 7 confluence factors to pass. This deliberately limits trades to the highest-conviction opportunities."
- List the 7 factors (each as a small card with icon + title + 1-sentence description):
  1. HTF bias alignment
  2. Liquidity sweep present
  3. Fair value gap identified
  4. Order block retest
  5. Session alignment
  6. Previous day's high/low swept
  7. Structural break confirmation
- Body: "Beyond these structural factors, three fundamental filters must also pass."

**Section 3 — Fundamental filters: the second layer**
- H2: "Fundamental filters — the second layer"
- Three feature cards:
  1. "Interest rate differentials" — body: "Comparing the monetary policy stance of each currency in the pair. Misaligned rate paths can invalidate an otherwise-valid setup."
  2. "Economic calendar" — body: "No trades within 1 hour of red-folder economic events. Volatility around news releases produces whipsaw moves that invalidate SMC structure."
  3. "DXY correlation" — body: "USD pairs must align with the US Dollar Index trajectory. Contrary setups get filtered. (JPY crosses skip this filter since they don't contain USD.)"

**Section 4 — 9 pairs, two sessions**
- H2: "9 pairs, 2 sessions, disciplined timing"
- Pair grid: nine small pair cards with country flags (SVG) and pair codes in mono:
  - EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF (six majors)
  - GBP/JPY, EUR/JPY, AUD/JPY (three JPY crosses)
- Below the grid, two session cards:
  1. "London session" — 07:00-10:00 GMT — body: "Deep liquidity during the London open. Major institutional order flow often establishes the day's direction during this window."
  2. "NY AM session" — 12:30-15:30 GMT — body: "New York open overlap with London. High volatility, strong trending moves, and meaningful economic releases drive setups."
- Under the session cards: "We don't trade the Asian session — price action there tends to be range-bound, and SMC setups perform differently. The discipline of trading only London and NY AM is deliberate."

**Section 5 — How you participate**
- H2: "How you participate"
- Four steps numbered 01 to 04 (Step 5 from earlier versions is removed):
  1. "Sign up on HayPlusbot" — body: "Email verification only. Takes 2 minutes."
  2. "Sign the risk disclosure" — body: "Quick acknowledgment of what copy trading involves. Required before accessing performance data or subscribing."
  3. "Open an HFM account via our referral link" — body: "If you don't have one under our IB code already. HFM handles KYC; budget 15-60 minutes depending on their queue."
  4. "Subscribe on HFcopy" — body: "Complete your subscription on HFM's HFcopy platform. From this point, our master account's trades mirror into yours automatically."
- Small callout below: "We don't manage your money. HFM does. Every trade, fee, and copy mechanic happens inside their platform."

**Section 6 — What makes this different**
- H2: "What makes this different"
- Four short statements as a 2×2 grid:
  1. "Discipline" — body: "3-7 A+ trades per week, not 20. Quality over volume."
  2. "Transparency" — body: "Full public performance history — no cherry-picking, no hidden drawdowns."
  3. "Simplicity" — body: "No bot to configure. No MT5 credentials to manage. No settings to maintain."
  4. "Authority" — body: "Authorised strategy provider on HFM's HFcopy platform."

**CTA block at the end**
- H2: "Ready to subscribe?"
- Two buttons: "Sign up →" (primary teal) and "Read the FAQ first" (ghost secondary)

**Footer** — same as landing.

## Constraints

- Dark mode, mobile responsive
- No mention of fee percentages or specific commercial terms
- Use inline SVGs for charts, pair flags, icons
- Use lucide-react for icons where appropriate
- Accessible heading hierarchy, semantic HTML

Output: single React artifact using Tailwind CSS, lucide-react.

=====

---

## Prompt 5 — Onboarding flow

Save as: `prototypes/p5-onboarding-flow.html`

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. Users sign up, acknowledge risk disclosure, verify their HFM account is under our IB code, and then subscribe on HFM's HFcopy interface. Users don't run bots themselves.

4-step onboarding flow. No phone verification. No payment. No funding verification.

## Brand aesthetic

Bloomberg Terminal × Linear.app × Stripe Dashboard. Dark-mode-first. Professional trading terminal energy.

## Design tokens

Background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75, coral #D85A30, amber #BA7517. Text #F5F6F8 primary, #A4A9B8 secondary, #6B7080 tertiary. Outfit for UI, JetBrains Mono for numbers.

## Build task

Build the HayPlusbot onboarding flow as a single React artifact showing all 4 steps as separate screens. Use internal state to switch between them with "next" and "back" buttons for prototype purposes — in production these are distinct routes.

Layout frame for all steps:
- Full-screen dark background with subtle radial teal glow upper-right
- Top bar: HayPlusbot logo left, step indicator centred ("Step X of 4" with thin progress bar), "Need help?" link right
- Content area centred, max-width 560px
- No site navigation — focused flow

**Step 1 — Email verification**
- H1 (28px weight 600): "Verify your email"
- Body: "We've sent a 6-digit code to jane@example.com. Enter it below to continue."
- A 6-digit code input: 6 separate boxes, auto-focusing to the next on each character, paste-friendly
- "Resend code" link below (with 60-second cooldown after click)
- Primary CTA "Verify email →"
- Error state: coral alert "That code doesn't match. Double-check or request a new one."

**Step 2 — Risk disclosure**
- H1: "Sign the risk disclosure"
- Body: "Before you can access performance data or subscribe to our strategy, please read and acknowledge our risk disclosure."
- Placeholder reference: "Full disclosure at [link] — in the real product, this is a separate screen with the complete document"
- Checkbox: "I've read the risk disclosure and agree to its terms"
- Primary CTA (disabled until checked): "I've signed the disclosure — continue"
- Small tertiary text: "The complete disclosure signing experience happens at /onboarding/disclosure in the production app."

**Step 3 — HFM account verification**
- H1: "Connect your HFM account"
- Body: "To subscribe to our strategy, your HFM account must be registered under our IB partner code. Enter your HFM account number to verify."
- Form: HFM account number (large input, 8 digits expected), server dropdown (HFM-Real, HFM-Real-Plus, HFM-Real-Pro)
- Primary CTA: "Verify account"
- Small tertiary: "We never ask for your trading password here. Your credentials stay with HFM."
- Alternative path for users without an HFM account (smaller link below primary CTA): "Don't have an HFM account? Open one through our referral link →"
- Verification states:
  - Success: teal alert "Account verified — under our IB partner code ✓"
  - Not-our-code failure: amber alert "This account isn't under our partner code. You'll need to open a new HFM account using our referral link."
  - Account-not-found failure: coral alert "We couldn't find this account. Double-check the number and server."

**Step 4 — Subscribe on HFcopy**
- H1: "Subscribe on HFcopy"
- Body: "Your HFM account is verified. Complete your subscription on HFM's HFcopy platform to start copying our strategy."
- Numbered list:
  1. "Click 'Open HFcopy →' below — opens HFM's subscription page in a new tab"
  2. "Configure your copy ratio on HFM's interface (recommended: 1:1 for matching master sizing)"
  3. "Set your maximum drawdown on HFM's interface (their defaults work for most subscribers)"
  4. "Confirm your subscription on HFM"
- Primary CTA (large, prominent, teal): "Open HFcopy →" (external-link icon)
- Small text below CTA: "Opens in a new tab. Takes 2 minutes to complete on HFM's platform."
- Callout: "After you subscribe on HFM, we detect your subscription within 5 minutes. Come back to your dashboard — no further action needed on our side."

**Final success screen** — after Step 4 complete (add as screen 5 for the prototype):
- Large teal check icon
- H1: "You're in."
- Body: "Your subscription is active. Trades from our master account will mirror into your HFM account automatically."
- Two CTAs: "Explore the dashboard →" (primary) and "Read the signal archive" (ghost secondary)

## Motion and interaction

- Step transitions: smooth left-slide animation (400ms ease-out)
- Progress bar fills smoothly as steps advance
- Back button works except on final success screen
- Prototype-only toggle: small "Jump to step [X]" selector at top (outside the content area) so reviewers can navigate all steps. Hidden in production.

## Constraints

- Dark mode, mobile responsive
- All numbers in JetBrains Mono (account numbers, verification codes)
- Accessible form semantics
- No emoji
- No mention of fee percentages or commercial terms

Output: single React artifact using Tailwind CSS and lucide-react.

=====

---

## Prompt 6 — User dashboard

Save as: `prototypes/p6-dashboard.html`

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. The authenticated user dashboard is a performance and transparency surface — users see master account performance, recent trades, signals, and their subscription status. Users don't trade on this dashboard; they manage subscription settings on HFM's side.

Access: must be signed in AND have signed the risk disclosure.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first. Information-dense. Professional.

## Design tokens

Background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75, coral #D85A30, amber #BA7517. Text #F5F6F8/#A4A9B8/#6B7080. Outfit + JetBrains Mono.

## Build task

Build the authenticated user dashboard as a single React artifact.

Layout:

**Sidebar (180px wide, fixed left)**
- HayPlusbot logo at top
- Subscriber count badge: "247 active subscribers" (small, mono)
- Nav items:
  - Overview (active)
  - Signals
  - Subscribe (only shown if user isn't yet subscribed)
  - Settings
- User email + logout at bottom

**Top bar (56px tall)**
- Breadcrumb left: "Dashboard"
- System status right: small dot + "All systems operational" (teal)
- Current UTC time (mono, 14px)

**Main content**

**Subscription status strip** (at top of main content, full width)

If user IS subscribed: teal success strip with teal-soft background
- Text: "You're subscribed to HayPlusbot's HFcopy strategy. Trades mirror automatically."
- Small action: "Manage on HFM →" (external link)

If user is NOT subscribed: amber warning strip with amber-soft background
- Text: "You're signed in but not yet subscribed. Complete subscription on HFcopy to start copying trades."
- Primary CTA: "Subscribe now →" (links to /subscribe)

**Master account performance** (main card, full width)
- H2: "Master account performance"
- Timeframe selector: 7d / 30d / 90d / All (90d active by default)
- Equity curve chart using recharts: teal line on subtle teal-soft area fill. Coral tints on drawdown portions.
- X-axis: dates in JetBrains Mono 11px at sensible intervals
- Y-axis: USD values in mono 11px on the right edge
- Tooltip on hover: shows specific trade outcome at that point
- Below the chart, stats strip (4 columns):
  - Balance: large mono number
  - 30d P&L: mono with sign colour-coding
  - 30d return %: mono with sign colour-coding
  - Win rate: mono percentage

**Two-column row below performance card:**

**Left — Recent A+ signals** (60% width)
- H3: "Recent A+ signals"
- 5 most recent signal cards (simplified):
  - Timestamp (mono 11px)
  - Pair + direction (e.g., "EUR/USD LONG") with direction arrow
  - Confluence score (pill, e.g., "6/7")
  - 2-line narrative
  - Outcome badge (Winner/Loser/Open with pips)
- Link at bottom: "View all signals →"

**Right — Recent closed trades** (40% width)
- H3: "Recent trades"
- Table with 5 rows:
  - Date (mono), Pair, Direction, Pips, USD P&L
- P&L cells colour-coded
- Link at bottom: "Full trade history →"

**Open positions** (full-width card)
- H2: "Open positions"
- Small tertiary subheader: "Updated every 60 seconds — showing data as of 18:41:18 UTC"
- If open positions exist: table with 2 example rows showing pair, direction, entry, current, unrealised pips (colour-coded), time open
- If no open positions: empty state with neutral message "No open positions. Watching for the next A+ setup." with a small animated radar SVG

**Quick stats** (3-column grid, small cards)
- 30d signal count (mono large, label "A+ signals this period")
- 30d win rate (mono percentage, label "Win rate")
- 30d net pips (mono with sign, label "Net pips")

**Bottom note**
- Small tertiary text centred: "Want to see your own account's performance? View your HFM account dashboard →"

**Footer** — minimal within the dashboard frame.

## Motion and interaction

- Live data indicators (small pulsing teal dots) on: subscriber count widget, master account balance, open positions section
- Chart hover tooltip animates smoothly (200ms fade)
- Sidebar nav: active item has teal left border (3px)
- Cards don't hover-lift (static surface elevation only)

## Constraints

- Dark mode only
- All numbers in JetBrains Mono
- Mobile responsive: sidebar collapses to bottom tab bar below 768px; two-column row stacks; tables scroll horizontally with visible scroll affordance
- Accessible: semantic headings, keyboard navigation, ARIA labels on interactive elements
- No mention of fee percentages or commercial terms
- Use recharts for equity curve
- Use lucide-react for icons

Example data (realistic):
- 247 active subscribers
- Master balance: $14,247.18
- 30d P&L: +$687.50 (+5.1%)
- Win rate: 64.2% (27W, 15L)
- 47 signals in last 90 days

Output: single React artifact using Tailwind CSS, recharts, lucide-react.

=====

---

## Prompt 7 — Chart component

Save as: `prototypes/p7-chart-component.html`

=====

# Project context

HayPlusbot trading chart component. Used in dashboard and marketing pages to display master account performance via equity curves, and occasionally individual trade setups with SMC annotations.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first.

## Design tokens

Background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75 positive, coral #D85A30 negative. Text #F5F6F8/#A4A9B8/#6B7080. JetBrains Mono for all chart numbers.

## Build task

Build a reusable chart component as a single React artifact showing three variants:

**Variant 1 — Equity curve**
- Line chart showing portfolio equity over time
- Teal line with subtle teal-soft area fill below
- Coral shading on drawdown portions (where current value is below recent local high)
- X-axis: dates in JetBrains Mono 11px tertiary
- Y-axis: USD values in mono 11px on right edge
- Starting balance as dashed horizontal reference line
- Subtle gridlines at major Y-axis values (1px, low opacity)
- Hover tooltip: dark card with teal border, shows exact value + date in mono

**Variant 2 — Annotated price chart**
- Candlestick chart of a single trading setup (e.g., EUR/USD 1-hour)
- SMC annotations: teal rectangles for order blocks, teal-soft rectangles for fair value gaps, coral arrows for liquidity sweeps, labels for BOS points
- Entry/SL/TP lines as horizontal reference lines with price labels (mono)
- R:R ratio shown as teal text annotation

**Variant 3 — Performance comparison**
- Multi-line chart comparing master account vs benchmark (e.g., EUR/USD spot)
- Two lines: teal (master) and neutral grey (benchmark)
- Legend, crosshair on hover

Layout: all three variants stacked in the artifact with H2 labels between them. Each with 400px height, full container width.

## Constraints

- Dark mode only
- Use recharts for line/area charts; use inline SVG for the annotated candle chart (recharts doesn't do candlesticks well)
- All numbers JetBrains Mono
- Accessible: ARIA labels on charts, alt-text describing trends
- Responsive: charts adjust width on resize

Output: single React artifact using Tailwind CSS, recharts, inline SVG.

=====

---

## Prompt 8 — Signal card

Save as: `prototypes/p8-signal-card.html`

=====

# Project context

Signal cards represent individual A+ setups fired by the HayPlusbot strategy. Used in dashboard, signal archive, landing page recent signals, and admin signal audit. Must be reusable, consistent, and information-dense.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first.

## Design tokens

Background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75 positive, coral #D85A30 negative, amber #BA7517 caution. Text #F5F6F8/#A4A9B8/#6B7080. JetBrains Mono for all numbers.

## Build task

Build a signal card component as a single React artifact showing four variants:

**Variant 1 — Active signal (open position)**
Card structure:
- Top row: timestamp (mono 11px tertiary) on left, confluence score pill ("6/7") on right in teal
- Middle: pair code large (e.g., "EUR/USD") with direction arrow (teal up for LONG, coral down for SHORT)
- Price row: Entry/SL/TP labels with values in mono (colour-coded sign where applicable)
- Narrative: 2-3 sentence explanation of why the setup fired
- Fundamental filter badges: 3 pills (Rates / Calendar / DXY) — teal if passed, amber if skipped (for non-USD crosses), coral if failed
- Bottom row: "OPEN" badge in teal with pulsing dot, time-open counter

**Variant 2 — Winner signal (closed in profit)**
- Same layout as Variant 1 but:
- Card has subtle teal-soft border on left (3px accent)
- Bottom row replaces OPEN with "+47 pips" in teal mono

**Variant 3 — Loser signal (closed at loss)**
- Same layout as Variant 1 but:
- Card has subtle coral-soft border on left
- Bottom row shows "-23 pips" in coral mono

**Variant 4 — Evaluated but rejected (didn't fire)**
- Card has tertiary grey styling (muted)
- Bottom row: "REJECTED — Factor 6 failed" or similar
- Narrative explains which factor failed

Layout: all four variants arranged in a 2×2 grid in the artifact, with labels under each.

## Constraints

- Dark mode only
- Numbers JetBrains Mono, everything else Outfit
- Cards should work at 320px-500px widths (responsive)
- Pills and badges use correct colour coding per design system
- Use lucide-react for arrows and icons

Output: single React artifact using Tailwind CSS, lucide-react.

=====

---

## Prompt 9 — Fundamental bias panel

Save as: `prototypes/p9-fundamental-bias.html`

=====

# Project context

Fundamental bias panel shows current macro conditions for each of the 9 traded pairs. Used on dashboard and signal cards. Static informational widget.

## Brand aesthetic

Bloomberg Terminal × Linear. Dark-mode-first. Information-dense.

## Design tokens

Background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75, coral #D85A30, amber #BA7517. JetBrains Mono for numbers.

## Build task

Build the fundamental bias panel as a single React artifact.

Structure:

**Header**
- H2: "Fundamental bias"
- Subheader: "Rate differentials, calendar, and DXY by pair"
- Last-updated timestamp (mono 11px tertiary)

**Pair grid** (9 rows, one per pair)
Each row shows:
- Left: pair code (mono) with flags
- Middle-left: Rate differential indicator (teal arrow up if favourable for our typical direction, coral arrow down if unfavourable, mono value showing exact differential e.g., "+2.25%")
- Middle: Calendar alert (amber warning icon if red-folder event within 1 hour, else blank)
- Middle-right: DXY correlation (for USD pairs: teal check if aligned, coral X if contrary, amber dash if N/A for JPY crosses)
- Right: Overall bias label (teal "BULLISH" / coral "BEARISH" / amber "NEUTRAL" / grey "N/A")

Rows have subtle 1px border separator, alternating row backgrounds (surface / surface-elevated very subtly).

**Summary strip below the grid**
- Three small stats: "5 pairs bullish", "2 pairs bearish", "2 pairs neutral"

## Constraints

- Dark mode only
- All numbers JetBrains Mono
- Realistic example data showing mix of bullish/bearish/neutral states
- Use lucide-react for arrows and icons (TrendingUp, TrendingDown, AlertTriangle, Check, X, Minus)
- Accessible: semantic table, screen-reader-friendly text labels alongside colour cues

Example pair data to use:
- EUR/USD: +0.50% rate diff, no calendar event, DXY aligned, BULLISH
- GBP/USD: -0.75% rate diff, calendar event in 45min, DXY contrary, BEARISH
- USD/JPY: +4.25% rate diff, no event, DXY aligned, BULLISH
- AUD/USD: -1.00% rate diff, no event, DXY contrary, BEARISH
- USD/CAD: +0.25% rate diff, no event, DXY aligned, NEUTRAL
- USD/CHF: +3.50% rate diff, no event, DXY aligned, BULLISH
- GBP/JPY: +5.00% rate diff, no event, DXY N/A, BULLISH
- EUR/JPY: +3.75% rate diff, no event, DXY N/A, BULLISH
- AUD/JPY: +3.25% rate diff, no event, DXY N/A, NEUTRAL

Output: single React artifact using Tailwind CSS and lucide-react.

=====

---

## Prompt 10 — Performance analytics

Save as: `prototypes/p10-performance-analytics.html`

=====

# Project context

Performance analytics section for the master account. Used in dashboard and admin views. Shows detailed breakdowns of strategy performance over time.

## Brand aesthetic

Bloomberg Terminal × Linear. Dark-mode-first. Information-dense, precise.

## Design tokens

Standard HayPlusbot: background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75, coral #D85A30, amber #BA7517. Outfit + JetBrains Mono.

## Build task

Build the performance analytics page as a single React artifact.

Layout:

**Header**
- H1: "Performance analytics"
- Timeframe selector (7d / 30d / 90d / 1y / All) — 90d active

**KPI row (4 cards)**
Each card shows a single metric large:
- "Total P&L" — mono large with sign, subtitle "Last 90 days"
- "Win rate" — mono percentage, subtitle "27W · 15L"
- "Profit factor" — mono decimal (e.g., "2.14"), subtitle "Ratio of gross wins/losses"
- "Max drawdown" — mono percentage with coral colour, subtitle "Largest peak-to-trough"

**Equity curve** (full-width card)
- H2: "Equity curve"
- Line chart (recharts) showing daily equity values over the selected timeframe
- Teal line with teal-soft area fill; coral tints on drawdown periods
- Annotation markers at notable events (e.g., biggest winner, biggest loser)

**Monthly breakdown** (full-width table)
- H2: "Monthly breakdown"
- Table with columns: Month, Trades, Winners, Losers, Win rate, Pips, P&L, Drawdown
- One row per month over the selected timeframe
- Colour coding on P&L column (teal positive, coral negative)
- Monthly rows are interactive — click expands to show that month's individual trades

**Two-column row:**

**Left — Distribution of trades by outcome** (50% width)
- H2: "Trade outcomes"
- Horizontal bar chart showing: Winners count, Losers count, Breakeven count
- Stacked or grouped bars with teal/coral/tertiary colouring

**Right — Distribution by pair** (50% width)
- H2: "Performance by pair"
- Horizontal bar chart showing net pips per pair across the 9 pairs
- Bars colour-coded by performance (teal for winners, coral for losers)

**Drawdown analysis** (full-width card)
- H2: "Drawdown periods"
- Timeline chart showing drawdowns below zero (area chart, coral)
- Below chart: table of notable drawdowns with duration, depth, recovery time

## Constraints

- Dark mode only
- All numbers JetBrains Mono
- Mobile responsive: charts stack vertically on narrow screens, tables scroll horizontally
- Use recharts for all charts
- Accessible: chart descriptions, keyboard navigable tables

Realistic example data:
- 90-day P&L: +1,247 pips / +$3,480
- Win rate: 64.2%
- Profit factor: 2.14
- Max drawdown: -7.3%
- 12 months of data with monthly variance (some positive, some negative months)

Output: single React artifact using Tailwind CSS, recharts, lucide-react.

=====

---

## Prompt 11 — Settings

Save as: `prototypes/p11-settings.html`

=====

# Project context

Settings page in the authenticated dashboard. Simple — just email preferences, notification channels, subscription status (read-only), and account deletion. Most users rarely visit this page.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first.

## Design tokens

Standard HayPlusbot. Outfit + JetBrains Mono.

## Build task

Build the settings page as a single React artifact.

Layout:

**Sidebar nav** (same as dashboard — fixed left, 180px)

**Main content**
- H1: "Settings"
- Subheader: "Manage your HayPlusbot account preferences."

**Section 1 — Account**
- H2: "Account"
- Email: "jane@example.com" (verified, small teal check badge)
- Country: "Nigeria" (read-only, per signup)
- Joined: "Apr 15, 2026" (mono tertiary)

**Section 2 — Notifications**
- H2: "Notifications"
- Subheader: "Choose how we reach you."

Grouped toggles:

Email notifications:
- New A+ signals: toggle (default on)
- Weekly performance summary: toggle (default on)
- Service announcements: toggle (default on, dimmed — can't be disabled)

Telegram notifications (if user has linked Telegram):
- Link Telegram (button if not linked)
- "Linked as @janetrader" (if linked, with unlink option)
- Real-time signal alerts via Telegram: toggle (default off)

**Section 3 — Subscription status** (read-only)
- H2: "Subscription"
- Status: large teal badge "Active" (if subscribed) or amber "Not subscribed" (if not)
- Subscribed since: "Apr 20, 2026" (mono)
- HFM account: "****4472" (last 4 only)
- Action button: "Manage subscription on HFM →" (external link)
- Small tertiary text: "Unsubscribe, pause, or change copy settings through HFM's HFcopy platform. We can't modify your subscription on our end."

**Section 4 — Risk disclosure**
- H2: "Risk disclosure"
- Status: "Signed on Apr 15, 2026 · Version 3.0" (mono tertiary)
- Button: "Download signed PDF" (ghost secondary)

**Section 5 — Danger zone**
- H2: "Danger zone" (coral-tinted section header)
- Card with coral-soft border:
  - "Delete my HayPlusbot account"
  - Body: "Removes your HayPlusbot account and all associated data. Your HFM account is unaffected — that's your relationship with HFM, not us. This action is irreversible."
  - Destructive CTA button: "Delete my account" (coral)
  - On click: modal with typed confirmation ("Type DELETE to confirm")

## Constraints

- Dark mode only
- Toggles animate smoothly (200ms ease-out)
- Danger zone visually distinct (coral accents)
- Accessible: semantic labels, toggle ARIA state announcements
- No mention of fee percentages

Output: single React artifact using Tailwind CSS, lucide-react.

=====

---

## Prompt 13 — Risk disclosure signing page

Save as: `prototypes/p13-risk-disclosure.html`

**Note:** this is the longest, most complex prototype. The full disclosure text is embedded in the prompt. Budget 30-45 minutes of iteration time after initial generation.

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. The risk disclosure signing page is a legally binding consent step in the onboarding flow. Required before users can access performance data or subscribe.

## Brand aesthetic

Bloomberg Terminal × Linear.app × Stripe Dashboard. Dark-mode-first. Professional trading terminal energy. Information-dense but uncluttered. Precise typography. Subtle micro-interactions. No emoji. No stock photography.

## Design tokens

Colour palette:
- Background base: #0A0B0F
- Surface: #12141B
- Surface elevated: #1A1D26
- Border subtle: rgba(255,255,255,0.06)
- Border default: rgba(255,255,255,0.10)
- Text primary: #F5F6F8
- Text secondary: #A4A9B8
- Text tertiary: #6B7080
- Teal: #1D9E75
- Teal soft: rgba(29, 158, 117, 0.12)
- Coral: #D85A30
- Coral soft: rgba(216, 90, 48, 0.12)
- Amber: #BA7517
- Amber soft: rgba(186, 117, 23, 0.12)

Typography:
- Outfit (400, 500, 600) for UI
- JetBrains Mono (400, 500) for numbers
- Scale: 12, 13, 14, 16, 20, 24, 32, 48px

## Build task

Build the risk disclosure signing screen as a single React artifact using Tailwind CSS.

This is Step 7 of an onboarding flow. The user has already verified email; now they must read and acknowledge the full risk disclosure before accessing any product content.

The disclosure text has 9 parts. All 9 parts must appear in full — this is not a summary.

### Layout frame

- Top bar: HayPlusbot logo left, step indicator "Step 2 of 4" centred with progress bar, "Need help?" link right
- Content area max-width 800px, centred (wider than forms because this is reading material)

### Screen structure

**Hero introduction** at top:
- H1 (Outfit 28px weight 600): "Before we continue — please read this"
- Subheadline (16px secondary): "This explains what HayPlusbot does, what it doesn't do, and where your responsibility ends and ours begins. We've written it in plain English because we want you to actually read it."
- Amber-soft callout: "You cannot proceed until you have scrolled through the full document and ticked all three acknowledgment boxes. This usually takes 8-10 minutes of reading."
- Reading-time estimate: "~9 min read" in mono 13px tertiary with progress indicator "0% read"

**Table of contents** (inline, not sticky):
- H3: "What's in this document"
- Clickable anchor links to each of the 9 parts:
  - Part 1 — Understanding the risk (3 min)
  - Part 2 — What HayPlusbot is, legally (2 min)
  - Part 3 — The responsibility split (3 min)
  - Part 4 — The commercial arrangement (1 min)
  - Part 5 — Specific acknowledgments (1 min)
  - Part 6 — What happens if something goes wrong (1 min)
  - Part 7 — Jurisdiction and governing law (under 1 min)
  - Part 8 — Changes to this disclosure (under 1 min)
  - Part 9 — Getting help (under 1 min)

**Main disclosure body** — each part as a major section with H2, separated by 32px top padding and subtle 1px border-top:

[PART 1]

## Part 1 — Understanding the risk

### Copy trading can lose you money

Most retail forex traders lose money over time. This is true whether they trade manually, use a bot, or copy a strategy like ours. Before anything else, you must understand:

**You can lose some or all of the capital you deposit into your HFM account.** Every trade our strategy takes carries real loss risk. Our methodology is designed to take disciplined, high-quality setups, but no methodology eliminates losses. Losing streaks happen. Drawdown periods happen.

**Leverage amplifies both gains and losses.** Your HFM account has its own leverage setting, configured by you within HFM's platform. Higher leverage means faster capital destruction when trades go wrong. HayPlusbot does not control your leverage — HFM does, and you choose the level.

**You may lose more than your initial deposit in extreme cases.** HFM has negative balance protection for retail clients in some jurisdictions, but not all. Review your HFM account terms for your specific jurisdiction.

**Past performance does not guarantee future results.** Every performance number on HayPlusbot.com — equity curves, win rates, monthly returns — reflects what the strategy has done historically. Your actual results will differ. Markets evolve. Strategies that worked for years can stop working.

### Copy-trading-specific risks

**Your returns will differ from our master account's returns.** Slippage, spread, your copy ratio, your account size — all affect your actual outcomes. You will not precisely mirror our master account's percentage returns even with perfect copy settings.

**Fill differences are normal.** Your account may enter trades at slightly different prices than the master. Sometimes better, sometimes worse. This is inherent to copy trading.

**Operational risks affect copied trades.** If MetaAPI.cloud has an outage, if HFM's copy-trading infrastructure has a hiccup, if our internet connection fails during a trade — you bear whatever the outcome was at the time. We cannot prevent these and they do sometimes happen. We monitor and respond, but we cannot eliminate them.

**Strategy changes and discontinuation.** We may at any point modify the strategy (pair selection, risk parameters, session windows) or pause it entirely. When we make material changes, we notify subscribers by email in advance. If we discontinue the strategy, HFM stops mirroring new trades — any positions already open at that point are handled per HFM's standard copy-trading rules.

[PART 2]

## Part 2 — What HayPlusbot is, legally

### We are an HFM strategy provider

Your client (HayPlusbot's operator) is registered and authorised by HFM as a strategy provider on HFcopy. This is a defined role within HFM's copy-trading ecosystem. HFM's compliance framework covers the regulated aspects of this arrangement — subscriber onboarding, KYC, fee collection, mirror-ratio enforcement, withdrawal protection.

HayPlusbot rides on top of HFM's authorisation, not alongside it. We do not hold independent financial services authorisation from the Nigerian SEC, the UK FCA, CySEC, or any other regulator.

### We are not your financial advisor

HayPlusbot does not assess your personal financial circumstances, investment goals, risk tolerance, or whether forex copy trading is suitable for you. Every person who subscribes to our strategy receives the same mirrored trades, identically, based on our objective strategy criteria. This is not personalised investment advice.

If you need personalised advice, consult a licensed financial advisor in your jurisdiction before subscribing.

### We never touch your money

At no point does HayPlusbot hold, receive, or have access to your trading capital. Your money stays in your own HFM account, in your name, under your control. When you subscribe to our strategy on HFcopy, you authorise HFM to copy our master account's trades into yours — you are never authorising HayPlusbot to do anything with your account.

You can unsubscribe from our strategy at any time through HFM's HFcopy interface, instantly, without contacting us.

[PART 3 — Responsibility split, render with special visual treatment]

## Part 3 — The responsibility split

This is the most important section. Please don't skip it.

**Present as two side-by-side cards (stack on mobile):**

**What HayPlusbot is responsible for** (left card, teal-soft background, 3px teal left border):
- Running the strategy as described
- Honest performance reporting
- Transparent methodology
- Data security
- Operational care
- Support (72-hour response time)

[Each bullet with brief 1-sentence explanation]

**What you are responsible for** (right card, amber-soft background, 3px amber left border):
- Your HFM account
- Your subscription decisions
- Your suitability assessment
- Your tax obligations
- Legal compliance in your jurisdiction
- Monitoring your HFM account

[Each bullet with brief 1-sentence explanation]

**What neither of us controls** (full-width card below both):
HFM's platform availability and execution quality. Market gaps, flash crashes, central bank interventions. Your country's regulatory environment. Internet connectivity and infrastructure.

Losses from any of these are a normal part of trading risk, borne by you as the account holder.

[PART 4]

## Part 4 — The commercial arrangement

HayPlusbot does not charge you directly. Our revenue comes through HFM in two ways:

**Performance fee — our primary revenue.** HFM deducts a performance fee from the profits on trades copied from our strategy into your account, and pays 40% of that fee to HayPlusbot. 60% of profits are retained by you. No fee on losses. No monthly fee. No fixed charge.

**IB rebates — secondary revenue.** If you opened your HFM account via our referral link, HFM pays us a small commission on your trading volume regardless of whether you subscribe to our strategy or trade manually. Your trading costs at HFM are identical whether you signed up via our link or directly — the rebate comes from HFM's side, not yours.

Both lines are administered and paid by HFM. We don't invoice you. We don't charge your card. We don't send you bills.

You will see the performance fee structure in HFM's HFcopy subscription interface when you subscribe. HFM's interface shows the fee percentage and calculation method. If you're ever unclear about what you've been charged, HFM's support has the detailed breakdown.

[PART 5 — The critical interactive acknowledgments]

## Part 5 — Specific acknowledgments

By ticking the three boxes below, you confirm that:

**Box 1 — Trading risk acknowledgment**

Present as card with teal left border (2px) when unchecked, full teal border when checked:

Summary title: "Trading risk acknowledgment"

Quoted text (15px weight 400 secondary, indented blockquote):
"I understand that subscribing to HayPlusbot's copy-trading strategy carries substantial risk of loss. I may lose some or all of the capital I deposit into my HFM account. Past performance of the master account does not guarantee future results. I am subscribing with capital I can afford to lose. I understand that my results will differ from the master account's results due to slippage, spread, my copy ratio, and my account size."

Large native checkbox: "I acknowledge and agree"
Enabled only after scrolling past Part 1.

**Box 2 — Relationship acknowledgment** (same pattern)

Quoted text:
"I understand that HayPlusbot is a strategy provider on HFM's HFcopy platform, not a regulated financial advisor. HayPlusbot does not hold my funds, my MT5 credentials, or have any access to my HFM account — all copy-trading mechanics are handled by HFM. I understand that I can unsubscribe from the strategy at any time through HFM's interface, instantly, without HayPlusbot's cooperation."

Enabled only after scrolling past Part 2.

**Box 3 — Responsibility acknowledgment** (same pattern)

Quoted text:
"I understand and agree to the responsibility split in Part 3. I am responsible for my HFM account, my copy configuration, my suitability to trade, my tax obligations, and my legal compliance in my jurisdiction. HayPlusbot is responsible for running the strategy as described, reporting performance honestly, protecting my data, operational care, and support. I have read Part 4 and understand how HayPlusbot earns revenue through HFM."

Enabled only after scrolling past Part 3.

[PART 6]

## Part 6 — What happens if something goes wrong

**With our strategy:** If you believe the master account is behaving outside our documented methodology, email hello@hayplusbot.com. We'll review the audit logs and share the relevant trace with you.

**With HFM's mirroring:** If you have concerns about how HFM is copying trades, subscription fees, platform availability, KYC, withdrawals, or anything happening inside HFM's platform, contact HFM support directly.

**Our liability limits:** HayPlusbot's liability is limited to direct demonstrable losses caused by our gross negligence or wilful misconduct. We do not offer refunds. Nothing in this section overrides non-excludable statutory rights under Nigerian law, English law, or similar consumer frameworks.

[PART 7]

## Part 7 — Jurisdiction and governing law

This acknowledgment and your relationship with HayPlusbot are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the exclusive jurisdiction of the courts of Lagos State.

Your relationship with HFM is separately governed by HFM's terms. HFM's jurisdiction clauses take precedence for matters involving HFM's platform.

[PART 8]

## Part 8 — Changes to this disclosure

We may update this document over time. Material changes trigger email notification and a re-acknowledgment prompt on your next authenticated session. Minor changes (clarifications, typos) don't require re-acknowledgment but are timestamped in version history.

[PART 9]

## Part 9 — Getting help

For questions about this disclosure or HayPlusbot: email **hello@hayplusbot.com**.

For HFM account matters (subscribing, unsubscribing, deposits, withdrawals, fees): contact HFM directly through their support channels.

**Signing details** (signing metadata card at the bottom):
- Your name: [AUTO-FILLED — show "Jane Doe" for prototype]
- Your email: [AUTO-FILLED — "jane@example.com"]
- Your country of residence: [AUTO-FILLED — "Nigeria"]
- Document version: 3.0
- Document hash: "will be generated at signing"
- Signed at (UTC): "will be recorded at click"
- IP address: "will be recorded at click"

Small tertiary note below: "A PDF copy of this signed acknowledgment will be emailed to you immediately upon completion. Keep it."

### Sticky reading progress bar (fixed at bottom, 64px tall)

- Left: "Reading progress" + horizontal progress bar with % read (tracked by scroll)
- Middle: three indicator dots showing checkbox states ("Box 1 ○ Box 2 ○ Box 3 ○"), each turning teal+filled when checked
- Right: primary action button
  - While reading: disabled, "Read all three acknowledgments to continue"
  - All three checked: enabled, "Proceed to final step →" with teal-soft background, teal text, subtle glow

### Interaction

- Scroll triggers progress updates smoothly
- Scrolling past a Part unlocks the corresponding checkbox with subtle animation
- Clicking toc links smooth-scrolls to that Part
- Final button transitions from disabled to enabled with one-time 1-second teal glow pulse

## Constraints

- Dark mode only
- Professional, reading-oriented layout (not legal-terms dense)
- Generous whitespace between Parts (64px)
- Max line length for readability (~680px content width within 800px container)
- No emoji
- Semantic HTML, proper heading hierarchy, checkboxes are native inputs for screen readers
- Focus states visible (2px teal outline)
- Mobile responsive: side-by-side responsibility cards stack below 768px; sticky bar compresses

Output: single React artifact using Tailwind CSS and lucide-react.

=====

---

## Prompt 16 — Admin dashboard

Save as: `prototypes/p16-admin-dashboard.html`

**Note:** this is the largest prototype. Build in sections if necessary — Overview + Master Account + Users first, then add Signal Audit + HFM Sync + Revenue + System in a second iteration if context is tight.

=====

# Project context

HayPlusbot is a managed copy-trading strategy on HFM's HFcopy platform. The admin dashboard is the client's operational console — accessible only to admins, desktop-only (1024px+). Gives operational control: master account, users, signal audit, HFM sync, revenue, system kill switches.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first. Information-dense, professional, mission-control style.

## Design tokens

Standard HayPlusbot: background #0A0B0F, surface #12141B, surface elevated #1A1D26. Teal #1D9E75, coral #D85A30, amber #BA7517. Outfit + JetBrains Mono.

## Build task

Build the admin dashboard as a single React artifact. This is a large, multi-section artifact. Use internal state to navigate between sections.

### Overall layout (desktop-first, minimum 1440px viewport)

**Left sidebar (240px wide, full-height)**
- HayPlusbot logo at top
- Admin mode pill: amber-soft "Admin mode" with "View as user ↔" toggle
- Nav items (icon + label):
  - Overview (default active)
  - Master account
  - Users
  - Signal audit
  - HFM sync
  - Revenue
  - System
- Bottom: admin email, "Admin" badge, logout link

**Top bar (56px tall)**
- Breadcrumb left: "Admin / Overview"
- System health indicator centre-right: teal/amber/coral dot + "All systems operational"
- Current UTC time mono right
- Notification bell

**Main content area** — includes all sections below, switched via sidebar nav:

### Overview section (default)

**Row 1 — Critical health strip (4 compact cards)**
- Bot worker: "Running" teal, "Uptime 4d 7h 22m · last heartbeat 18s ago"
- Master account: "Connected" teal, "HFM-Real · ****9823 · balance $14,247.18"
- HFM Partner API: "Healthy" teal, "Last sync 03:47 UTC · next in 3h 12m"
- Active users: "247" mono, "+12 this week · 4 expired"

**Row 2 — Two columns:**

**Left (60%) — Recent activity feed:**
Panel with title "Recent activity" and 12 event entries in reverse chronological order. Each: timestamp (mono 12px tertiary) + event badge (colour-coded) + short description. Examples:
- 18:42 · Signal · A+ EUR/USD LONG fired on master (6/7 confluence)
- 18:42 · Trade · Master account order #28441 filled at 1.0842
- 18:31 · HFcopy · New subscriber: +1 (total 148)
- 18:17 · Signal · GBP/USD LONG evaluated, rejected (5/7 confluence)
- 17:41 · User · New signup: mo@example.com (email verified)
- (etc.)

Each entry clickable (hover teal left border).

**Right (40%) — Key metrics sidebar (stacked cards):**
- Today's A+ signals: "3" big mono, breakdown, weekly cap progress bar
- Master account P&L today: "+$247.50" teal, breakdown, tiny sparkline
- New subscribers today: "+4", breakdown, link to analytics

**Row 3 — Attention required** (only if flagged items)
Amber-soft callout strip with list of items needing admin action. Example: "HFM Partner API reporting 2 failed sync attempts — investigate".

### Master account section

**Row 1 — Account status and controls:**
Large card, 2-column internal layout.
- Left: account metadata (number, server, currency, balance, equity, leverage, connection status, MetaAPI session uptime)
- Right: big buttons:
  - "Pause bot" (amber, one-click halt)
  - "Close all open positions" (coral, typed confirmation "CLOSE ALL")
  - "Resume bot" (teal when paused, disabled when running)
  - "Reset daily circuit breakers" (secondary ghost)

**Row 2 — Open positions table**
Standard table, admin view has no 60s delay. Columns: Position ID, MetaAPI order ID, pair, direction, entry, current, unrealised P&L pips, unrealised P&L USD, time open, signal ID (clickable).

**Row 3 — Risk settings (editable)**
- Risk per trade slider (0.5%-2%, default 1.0%)
- Pair whitelist (9 toggles for EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, USDCHF, GBPJPY, EURJPY, AUDJPY)
- Session windows (read-only, small lock icon: London 07:00-10:00 GMT, NY AM 12:30-15:30 GMT)
- Confluence threshold (read-only, lock icon: A+ requires 6/7 confluence + all fundamentals)

**Row 4 — HFcopy strategy metrics** (4 small KPI cards)
- Current subscribers: 148
- Total mirror volume (lifetime): 2,847 standard lots
- 30-day performance fees earned: $1,247.30
- 30-day subscriber churn: -3 (net +4)

### Users section

**Two-panel layout:**

**Left panel — user list (380px)**
- Search input
- Filter pills: All / Subscribed / Not-subscribed / Disclosure-signed / Deleted
- Scrollable user rows: email (truncated), HFM account (masked), subscription status pill, country flag, last-seen timestamp
- Active row has teal left border (3px)

**Right panel — user detail (selected user)**
- Metadata block: email, phone (removed — no longer captured in v3), country, signup date, HFM account, disclosure signed date, subscription status
- Action buttons: Force re-verify HFM account, manually mark subscribed/unsubscribed, delete account (typed confirmation)
- Tabs: Activity / Signals (N/A for users in v3 — no per-user signals), Notifications

### Signal audit section

Full forensic trail. Filter bar (date range / pair / classification / outcome). Table with rows expandable to show factor-by-factor breakdown.

### HFM sync section

**Row 1 — 3 sync status cards:** IB signup sync, subscription sync, HFcopy metrics sync. Each with last-success timestamp, next run, "Run now" button.

**Row 2 — API call log table** (last 50 HFM API calls)

**Row 3 — Rate limit status** (visual bar)

### Revenue section

**Row 1 — 4 KPI cards:** Total IB rebates lifetime, Total HFcopy fees lifetime, This month revenue, Month-over-month delta

**Row 2 — Monthly revenue stacked bar chart** (teal for IB rebates, amber for HFcopy fees), last 12 months

**Row 3 — Two side-by-side tables:** Top 10 IB rebate contributors, Top 10 HFcopy fee contributors

**Row 4 — Export button** (CSV/JSON/PDF)

### System section

**Row 1 — 3 Kill switch cards:**
- Global bot pause (destructive amber, typed confirmation "PAUSE ALL")
- New signups disabled (amber)
- Maintenance mode (amber)

Each: toggle + large badge when on + timestamp + reason note field.

**Row 2 — Feature flags** (list of toggles for experimental features)

**Row 3 — Admin users table** (add admin, remove admin — can't remove self)

**Row 4 — System config** (read-only: min funding none, inactivity N/A, max risk per trade 2%, daily A+ cap 2, weekly A+ cap 5, session windows, pair list)

**Audit log viewer** (integrated into System or as separate tab) — filterable list of all destructive admin actions with before/after JSON

## Interaction

- Destructive actions require typed confirmation
- All tables sortable, searchable
- Live data indicators (pulsing teal dots) on active states
- Keyboard shortcuts: ? for help, g o for overview, g m for master, g u for users, g s for system, / for search
- Smooth section transitions (300ms fade)

## Constraints

- Dark mode only
- Desktop-only — below 1024px show "please use a larger screen" message
- All numbers JetBrains Mono
- Extensive use of lucide-react icons
- Accessible: semantic HTML, live regions for activity feed, clear focus states
- Use recharts for charts

Example data throughout — 247 users, 148 HFcopy subscribers, $14,247 master balance, realistic operational metrics.

Output: single React artifact using Tailwind CSS, recharts, lucide-react. Section switcher at top for prototype review.

=====

---

## Prompt 17 — Subscribe flow

Save as: `prototypes/p17-subscribe-flow.html`

=====

# Project context

HayPlusbot subscribe page. After users have verified email, signed disclosure, and verified their HFM account is under our IB code, they land here. This is the conversion-critical page that hands them off to HFM's HFcopy subscription flow.

## Brand aesthetic

Bloomberg Terminal × Linear × Stripe Dashboard. Dark-mode-first.

## Design tokens

Standard HayPlusbot. Outfit + JetBrains Mono.

## Build task

Build the subscribe flow page as a single React artifact.

Layout:

**Sidebar nav** (dashboard-style)

**Main content**

**Hero**
- H1: "Subscribe to HayPlusbot's strategy"
- Subhead: "Your HFM account is verified and ready. Complete your subscription on HFcopy to start copying trades."

**Section A — Subscription summary card** (surface elevated, 1px border)
- H3: "Your subscription"
- Strategy: "HayPlusbot — SMC/ICT A+ Strategy"
- Master account: "Managed by HayPlusbot on HFM-Real"
- Fees: "Administered by HFM — you'll see the exact structure on HFM's subscription page"
- Pairs: "9 forex pairs (6 majors + 3 JPY crosses)"
- Sessions: "London (07:00-10:00 GMT) + NY AM (12:30-15:30 GMT)"
- Recommended minimum: "$100 USD equivalent in your HFM account"

**Tertiary guidance note** (below Section A, before Section B)
- 13px tertiary text, centred or left-aligned: "HFM sets their own minimum deposit requirements. For best copy-trading results, we recommend at least $100 USD equivalent in your HFM account. Below this, HFM may skip smaller trades or produce positions too small to be meaningful."

**Section B — How subscription works** (3 numbered cards)
1. "Click 'Open HFcopy' below" — body: "Opens HFM's strategy subscription page in a new tab"
2. "Configure your settings on HFM" — body: "Copy ratio, maximum drawdown, leverage cap — all on HFM's interface. Their defaults work for most subscribers."
3. "Confirm on HFM" — body: "HFM handles the rest. Your subscription is active."

**Primary CTA** (large, centred, prominent)
- Button: "Open HFcopy subscription →" (teal, external link icon)
- Small text below: "Opens in a new tab. Typically takes 2 minutes to complete on HFM's platform."
- IMPORTANT (hidden from user in prototype but should be documented in comments): in production, this CTA triggers a server-side balance check before redirect. If user's HFM balance is below our internal threshold, show an amber-soft error alert: "Your HFM account balance is below the minimum required for reliable copy trading. We recommend at least $100 USD equivalent. Please deposit additional funds and try again." User stays on this page. Above threshold — redirect to HFM's HFcopy subscription page in new tab.

For the prototype: include an "Error state" variant shown with the amber alert visible (and the primary CTA still shown), so the design team reviews both success-redirect state and the insufficient-balance blocked state.

**Section C — Important notes** (2 amber-soft callouts)
1. "You can unsubscribe anytime through HFM's interface. HayPlusbot doesn't manage your subscription — HFM does."
2. "Copy ratios and drawdown caps are configured on HFM's side. If you're unsure, the default 1:1 ratio works for most subscribers."

**Section D — What happens next**
- H3: "After you subscribe"
- Body: "We detect your subscription within 5 minutes. Your dashboard updates automatically. You'll receive a welcome email. Subsequent copied trades appear in your HFM account automatically — no further action from you."

**Footer** — standard

## Constraints

- Dark mode only
- Mobile responsive
- The "Open HFcopy subscription" button is the single most important element on the page
- No fee percentages mentioned
- External-link icons on anything that leaves HayPlusbot

Output: single React artifact using Tailwind CSS and lucide-react.

=====

---

## Prompt 18 — Signal archive

Save as: `prototypes/p18-signal-archive.html`

=====

# Project context

Authenticated browsing view of every A+ signal the strategy has ever fired. Educational and transparency surface. Users can filter by date, pair, outcome. Each signal shows reasoning and outcome.

Access: authenticated + disclosure-signed.

## Brand aesthetic

Bloomberg Terminal × Linear. Dark-mode-first. Information-dense.

## Design tokens

Standard HayPlusbot. Outfit + JetBrains Mono.

## Build task

Build the signal archive page as a single React artifact.

Layout:

**Sidebar nav** (dashboard-style)

**Main content**

**Header**
- H1: "A+ signal archive"
- Subhead: "Every signal HayPlusbot has fired, with the reasoning. Read to understand how the strategy thinks."

**Filter bar** (horizontal)
- Date range picker
- Pair dropdown (all 9 pairs + "All pairs")
- Outcome dropdown (Winners / Losers / All / Still open)
- Sort: Newest first (default) / Oldest first / Biggest winners / Biggest losers
- Search input

**Results count strip**
- "Showing 47 signals from Apr 2025 to Apr 2026 · 62% win rate · +1,247 total pips"

**Signal cards** (vertical scrolling list, pagination)
Each card — use the expanded signal card design with:
- Top row: timestamp, pair + direction, confluence score pill
- Price row: Entry/SL/TP prices
- Fundamental filter badges (3 pills — with amber "DXY skipped" for JPY crosses)
- 2-3 sentence narrative
- Outcome with pips (Winner/Loser/Open)
- Expand control to show full factor breakdown

When expanded:
- Full 7-factor breakdown with pass/fail indicators
- Timeframe context
- Screenshot placeholder (in production: actual chart snapshot)

**Pagination** at bottom

## Constraints

- Dark mode only
- Mobile responsive
- Numbers in JetBrains Mono
- Realistic example data — 47 signals spanning 12 months, mix of winners/losers/open, realistic confluence scores

Example signal to include:
- Timestamp: Apr 22, 2026 08:15 UTC
- Pair: EUR/USD · LONG
- Entry: 1.0842, SL: 1.0825, TP: 1.0895
- Confluence: 6/7 passed (Factor 6 "Previous day high swept" was marginal but qualifying)
- Fundamentals: Rates passed (+0.50%), Calendar clear, DXY aligned
- Narrative: "During London session, EUR/USD swept overnight highs before retracing into a daily order block. H4 bullish structure held. All three fundamental filters aligned."
- Outcome: Winner, +53 pips

Output: single React artifact using Tailwind CSS, lucide-react.

=====

---

## Summary

Once you've generated all 15 prototypes, your `prototypes/` folder will contain:

```
prototypes/
├── p0-design-system.html
├── p1-landing.html
├── p3-faq.html
├── p4-how-it-works.html
├── p5-onboarding-flow.html
├── p6-dashboard.html
├── p7-chart-component.html
├── p8-signal-card.html
├── p9-fundamental-bias.html
├── p10-performance-analytics.html
├── p11-settings.html
├── p13-risk-disclosure.html
├── p16-admin-dashboard.html
├── p17-subscribe-flow.html
└── p18-signal-archive.html
```

Commit each as you complete it. Expect the full prototype set to take 7-10 days of focused work.

Once prototypes are done, you're ready to run Claude Code Phase 2+ build prompts against them.
