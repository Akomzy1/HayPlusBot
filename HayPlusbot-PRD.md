# HayPlusbot — AI Forex Trading Strategy
## Product Requirements Document, v3.3

**Status:** Supersedes all previous versions (v1, v2, v2.1, v2.2, v3, v3.1, v3.2)
**Owner:** Tokunbo (AkomzyAi Consulting) on behalf of Nigerian client
**Jurisdiction:** Nigeria (client-side); users global (subject to HFM's geographic availability)
**Last updated:** 2026-04-24

> **v3.3 is a minor refinement over v3.** Fee language in risk disclosure Part 4 is now consent-preserving without stating percentages (directs users to HFM's subscription interface). Subscribe flow gains a two-tier balance verification gate — $100 recommended publicly, $90 enforced internally with a 5% buffer — accommodating FX fluctuation for good-faith subscribers while catching undersized accounts. All other v3 architecture unchanged: single-service HFcopy-only model, 9 pairs, London and NY AM sessions, HFM as current broker with `BrokerProvider` interface preserved for future migrations.

---

## 1. Product overview

HayPlusbot operates a managed copy-trading strategy on HFM's HFcopy platform. A single master HFM trading account runs an AI-driven SMC/ICT A+ setup engine, executing trades during London and NY AM sessions across 9 forex pairs. Subscribers on HFM mirror the master's trades into their own HFM accounts via HFM's HFcopy infrastructure. HayPlusbot itself is a public-facing brand, website, and strategy-operator — not a SaaS tool the user runs on their account.

**The user journey:**
1. User discovers HayPlusbot via marketing
2. Signs up with email verification only
3. Signs the risk disclosure (required before any product value is visible)
4. Opens an HFM account via HayPlusbot's mandatory IB referral link
5. Subscribes to HayPlusbot's master strategy on HFcopy
6. Returns periodically to HayPlusbot.com to view signal narratives, master performance, and educational content

No MT5 credentials stored. No per-user bot. No per-user auto-execute logic. No broker-lock enforcement in the v2.2 sense. The user's relationship is primarily with HFM for account operations, and with HayPlusbot for strategy subscription, educational content, and disclosure records.

**Revenue:** 40% of profits generated in subscribers' copy-trading accounts paid to HayPlusbot via HFM's HFcopy fee split. 60% retained by the subscriber. No subscription fee. No one-off payment. No direct payment processing on HayPlusbot. IB rebates on referred users' general trading volume are a secondary revenue line but not the primary focus.

**Positioning:** an authorised HFM strategy provider on HFcopy paired with a public transparency layer. Explicitly a copy-trading service, not educational software. Regulatory coverage rides on HFM's strategy provider authorisation.

## 2. Target users

Primary: retail forex traders who want exposure to a disciplined SMC/ICT strategy without running a bot themselves. Nigeria is the dominant market given the client's base and HFM Nigeria's presence; UK/EU and global English-speaking markets are secondary. Tertiary: traders who want to observe the strategy's live signal history to learn SMC methodology, whether or not they subscribe.

**Geographic constraint:** users must be in a jurisdiction where HFM operates AND HFcopy is available. HFM's country availability is live and may change; the marketing site should link to HFM's country list and avoid claiming universal availability.

Accessibility: Nigerian retail forex is mobile-first. The site must be fully functional on Android at 360px width minimum.

## 3. Positioning and legal framing

HayPlusbot is positioned as a **registered HFM strategy provider**, paired with a transparency and education website. This is a substantive copy-trading relationship, not passive education. Legal structure:

- Your client has been authorised by HFM as a strategy provider on HFcopy. HFM's compliance framework covers the regulated aspects — subscriber onboarding, KYC, risk disclosure at HFM's level, mirror-ratio enforcement, fee collection. HayPlusbot rides on top of that authorisation, not alongside it.
- HayPlusbot (the public-facing brand and website) operates from Nigeria. Governing law: Nigeria. Jurisdiction: Lagos State courts. NDPR applies for data protection. For UK/EU users, any non-excludable statutory rights continue to apply.
- HayPlusbot never takes custody of subscriber funds. All funds stay in the subscriber's HFM account at all times.
- HayPlusbot never holds subscriber MT5 credentials. Subscribers don't connect anything to HayPlusbot — the mirroring is handled entirely by HFM's platform.
- Marketing language continues to avoid "guaranteed returns" and personalised recommendations. Performance is always presented as past performance of the master account.
- HayPlusbot is not SEC-registered, not CBN-registered, not FCA-authorised in its own right. The only regulatory coverage is derivative of HFM's authorisation of your client as a strategy provider.

**Nigerian regulatory review:** engage a Nigerian fintech solicitor to review the terms, risk disclosure, and positioning language before launch. Specifically ask about: (a) whether operating as an HFM strategy provider sits outside direct SEC/CBN registration requirements, (b) Nigerian consumer protection implications of performance-based fees, (c) advertising compliance.

**This is AkomzyAi Consulting client work, not Tokunbo's personal venture.** Standard consulting engagement. Your client is responsible for their own regulatory obligations as an HFM strategy provider, Nigerian commercial registration, and any direct relationships with subscribers.

## 4. Commercial model

**Free signup across the board. No HayPlusbot-side fees.** Revenue comes entirely through HFM's fee split:

1. **HFcopy performance fee — primary revenue.** HFM deducts a performance fee from subscribers' profits on copied trades and remits 40% to HayPlusbot (i.e., to the client). 60% of profits are retained by the subscriber. No monthly fee. No fee on losses. Fee is collected by HFM from the subscriber's account after each trade closes in profit.

2. **IB rebates — secondary revenue.** Users who signed up via HayPlusbot's IB referral link generate standard HFM IB rebates on their trading volume regardless of whether they trade manually on their HFM account in addition to copying. Typical rate $3-10 per standard lot. This is a secondary line; HFcopy fees are the primary revenue focus under this model.

Because both revenue lines are administered by HFM, HayPlusbot does not process payments. No Stripe. No chargebacks. No refund disputes on HayPlusbot's side.

**The commercial risk profile is performance-contingent.** If the strategy has flat or losing months, HFcopy fees are zero and only IB rebates (secondary, smaller) provide revenue. The client should be comfortable with this volatility.

## 5. Out of scope (v3 backlog)

Not in v3:

- Per-user MT5 bot execution (the core v2.2 feature — removed in v3)
- Direct payments on HayPlusbot (no Stripe integration)
- Multi-broker support at launch (HFM-only)
- Asian session coverage (London and NY AM only)
- Exotics and commodity crosses
- Native mobile app (web-only, mobile-responsive)
- User-configurable copy ratios or risk settings on HayPlusbot (all on HFM's side)
- Per-user circuit breakers (no per-user execution to break)
- User-signed auto-execute consent (no user execution to consent to)
- Funding verification gate beyond the one-time subscribe-time balance check (see Section 7)
- License state machine — active/suspended/expired/revoked concept retired; users are either subscribed (confirmed via HFM API) or not
- Ongoing balance monitoring after subscription activation. The $90 internal gate checks at subscription time only.

## 6. Broker integration (HFM, with broker-agnostic design preserved)

### 6.1 Why we preserve broker-agnosticism

Even though v3 is HFM-only at launch, the architecture preserves swap-readiness for one reason: **if HFM ever becomes unworkable** (fee structure changes unfavourably, platform outages, policy changes, subscriber cap reached), the client needs a migration path. Not every broker offers copy-trading, but several do: Exness Social Trading, IC Markets ZuluTrade integration, Axi Copy Trading, Pepperstone cTrader Copy. A future migration would require moving subscribers to a different broker's copy platform, which is painful but not architectural.

The `BrokerProvider` interface design from v2.2 stays. It shrinks — methods related to per-user MT5 connection are removed — but the pattern is preserved.

### 6.2 The BrokerProvider interface

All broker-specific code lives behind a TypeScript interface:

```typescript
interface BrokerProvider {
  name: string; // 'hfm' | ... (future)
  signupUrl(referralToken?: string): string;
  verifyAccountUnderPartnerCode(accountNumber: string): Promise<VerificationResult>;
  getCopyTradingSubscriberCount(): Promise<number>;
  getCopyTradingStrategyMetrics(): Promise<StrategyMetrics>;
  getMasterAccountPositions(): Promise<Position[]>;
  getMasterAccountEquityCurve(range: TimeRange): Promise<EquityPoint[]>;
}
```

Methods removed compared to v2.2:
- `connectMT5(credentials)` — no per-user MT5 connection
- `getAccountBalance()` — no per-user balance check
- `getAccountStatus(accountNumber)` — subscription status comes from HFcopy API instead

The HFM implementation lives at `lib/brokers/hfm/provider.ts`. Shared types at `lib/brokers/types.ts`.

### 6.3 HFM as the current broker

**Partner API** (`lib/brokers/hfm/partner-client.ts`): IB tracking, account verification under partner code, subscriber count for the HFcopy strategy.

**HFcopy API** (`lib/brokers/hfm/hfcopy-client.ts`): master account strategy provider stats (subscriber count, aggregate mirror volume, performance stats, fees earned).

**MetaAPI.cloud**: used only for the master account connection — one persistent MetaAPI session. No per-user MetaAPI connections. Infrastructure cost becomes flat regardless of subscriber count.

**Partner referral link:** `https://register.hfm.com/?refid={CLIENT_IB_CODE}` — plug in real code when provided.

### 6.4 The IB referral requirement

**HFcopy subscription is blocked if the user's HFM account is not under our partner code.** Enforcement:

1. At signup, users are directed to HFM via the referral link. HFM's onboarding captures the referral attribution.
2. Before a user can progress from "signed up + disclosure signed" to "subscribed," HayPlusbot calls HFM's Partner API to verify the user's HFM account sits under our IB code.
3. If verification fails, the user sees a "Your HFM account is not linked under HayPlusbot's referral code. Please open a new HFM account using our referral link to subscribe" guidance screen. They cannot proceed to HFcopy subscription.
4. The HFM account number verification happens pre-subscription (before the user clicks "Subscribe on HFcopy"). This keeps the enforcement simple and prevents HFcopy subscriptions from users outside our referral funnel.

This is the single commercial-protection mechanism in v3. Without it, subscribers could sign up under other IBs and HayPlusbot earns no rebates on their trading volume — only HFcopy performance fees, which is the wrong incentive.

## 7. Signup and onboarding flow (radically simplified)

v3's flow is 4 steps (down from v2.2's 7):

**Step 1 — Email signup.** User enters email on landing page. Receives verification email. Clicks link. Email verified.

**Step 2 — Risk disclosure signing.** Three-checkpoint acknowledgment, scroll-gated. Signed before any product value is visible. SHA-256 document hash, IP capture, PDF generation. Per user's answer to the Q&A in the product planning: **disclosure signing is required before performance data, signal archive, or any substantive content can be viewed**. Unsigned users see a permanent "Sign the disclosure to access this content" modal on any protected page.

**Step 3 — HFM account verification.** User confirms they've opened an HFM account. If they haven't yet, the page directs them to do so via the IB link. Once they have an HFM account number, they enter it on HayPlusbot. HayPlusbot calls HFM's Partner API to verify the account is under our partner code. On success: ready to subscribe. On failure: blocked, guidance to open a new HFM account.

**Step 4 — Subscribe on HFcopy.** With broker-lock verified, the user is shown a "Subscribe on HFcopy" page with clear instructions and a deep link to HFM's strategy subscription page. The actual subscription happens on HFM's platform, not ours. Once HFM confirms the subscription (via daily sync), the user's HayPlusbot account status updates to "subscribed" and they get a welcome email plus access to subscriber-only dashboard features.

**Phone verification is removed** per your answer. Email verification alone is sufficient for v3.

**Balance verification at subscribe step (internal gate):** Before allowing the user to proceed from broker-lock verification to HFcopy subscription, HayPlusbot calls HFM's Partner API to verify the user's HFM account available balance. The gate is two-tiered:

- **Public-facing:** subscribers see "$100 USD minimum recommended" on the subscribe page. This is guidance for good-faith users funding for the first time.
- **Internal hard gate:** $90 USD equivalent. Users with USD-equivalent balance below $85 (accounting for a 5% FX-fluctuation buffer on the $90 threshold) are blocked from proceeding to HFcopy subscription with the message: "Your HFM account balance is below the minimum required for reliable copy trading. We recommend at least $100 USD equivalent. Please deposit additional funds and try again."
- Users with USD-equivalent balance of $85 or above are allowed to proceed to the HFcopy subscription handoff.
- FX conversion uses Finnhub live rates, cached 5 minutes.
- Error messages and public copy must never expose the $90 or $85 figures. Only $100 (the recommended minimum) appears in user-facing content.

The $10 buffer between the public recommendation ($100) and the internal hard gate ($90) deliberately accommodates users who fund in non-USD currencies (NGN, EUR, GBP). FX fluctuation between funding and verification could otherwise reject good-faith users who funded at-the-recommended-amount.

**This check runs once, at subscription time only.** Once a subscriber passes the gate and is active on HFcopy, HayPlusbot does not re-check their balance. Their balance may subsequently drop below the threshold through trading losses or withdrawal without affecting their subscription. HFM's own rules for subscriber accounts take over from that point.

**Auto-execute consent is removed** — no per-user execution.

**Risk disclosure is mandatory before content access** per your Q&A answer. This is the hard gate between "curious visitor" and "user" in v3.

## 8. The A+ strategy engine

Identical methodology to v2.2. Complete specification in `skills/smc-aplus-detection/SKILL.md` — that file's rules and thresholds don't change.

Key facts:
- **9 pairs: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, GBP/JPY, EUR/JPY, AUD/JPY** (the six majors from v2.2 plus three JPY crosses added for broader coverage consistent with a managed strategy)
- **Two sessions: London (07:00-10:00 GMT), NY AM (12:30-15:30 GMT)**. No Asian session.
- **Seven confluence factors, A+ = 6/7 plus all three fundamental filters pass**
- **Deterministic TypeScript, no LLM judgment in the core pipeline**
- **Circuit breakers:** 2 A+ trades/day, 5/week on the master account, pauses after 2 consecutive losses or 3 daily losses

**Execution runs once on the master account.** One MetaAPI call per signal. HFM's HFcopy infrastructure handles mirroring to all subscribers automatically.

**Handling non-USD crosses:** the DXY filter (Fundamental Filter 3) applies only when the pair being evaluated contains USD. For GBP/JPY, EUR/JPY, AUD/JPY setups, the DXY filter is skipped and the setup passes Fundamental Filters 1 and 2 only. Adjust SKILL.md accordingly.

Expected signal frequency: 3-7 A+ signals per week across 9 pairs. This is more than v2.2's 2-5 signals per week on 6 pairs, reflecting broader coverage.

## 9. User experience and dashboard

### 9.1 What the HayPlusbot site is in v3

Primarily a **marketing and transparency site** with a light authentication layer. It is not a trading interface. The user's actual trading experience happens on HFM's platform.

### 9.2 Public pages (unauthenticated)

- **Landing page** (/): hero emphasising copy-trading service, subscriber count widget, master account performance summary, CTAs to sign up
- **How it works** (/how-it-works): explains the strategy, the subscription mechanism, the fee structure
- **FAQ** (/faq): answers common questions about copy trading, HFM, subscription, performance
- **Pricing / Commercial** (/how-we-make-money): transparent explanation of the 40/60 fee split and IB rebates
- **Risk disclosure page** (/risk-disclosure): public read-only version of the disclosure (signing is in the authenticated flow)

### 9.3 Authenticated pages (email verified + disclosure signed)

- **Dashboard** (/dashboard): master account performance, recent signals, subscription status (not subscribed | pending | subscribed)
- **Signals archive** (/signals): historical A+ signals with narratives, searchable
- **Subscribe page** (/subscribe): HFM account verification + link to HFcopy subscription
- **Settings** (/settings): email preferences, notification channels (email + optional Telegram), subscription status (read-only, managed on HFM's side)

### 9.4 The subscriber count widget

Displayed prominently on the landing page hero and the public dashboard footer. "247 traders copying HayPlusbot" with a small teal pulsing dot for liveness. Cached from HFM's HFcopy API every 5 minutes. **Minimum display threshold: hide widget until count reaches 50 real subscribers.** Below 50, the counter creates negative social proof. Above 50, display consistently. Never inflate or synthesise.

### 9.5 Master account performance display

- Equity curve (last 30d / 90d / all) on the dashboard
- 30-day, 90-day, all-time stats: win rate, avg R:R, total pips, max drawdown, Sharpe
- Honest drawdown display — losing months shown clearly, not hidden
- 60-second delay on public "open positions" (anti-front-running) — this persists from v2.2
- Closed trades appear immediately (no delay); open positions delayed

### 9.6 Signal archive

Public (within authenticated content) scrolling feed of every A+ signal the engine has fired, with:
- Timestamp, pair, direction, entry/SL/TP, pips, outcome
- Confluence score and factor breakdown (educational)
- Claude-generated narrative (2-3 sentences) explaining why the setup fired
- Filter controls: date range, pair, outcome (winners/losers)

## 10. Admin dashboard

Same basic scope as v2.2, simpler implementation because there are no per-user bot controls.

**Sections:**
- **Overview** — system health, subscriber count, today's signals, today's master account P&L, recent activity feed
- **Master account** — master account state, pause/resume bot, close positions, adjust risk-per-trade, adjust pair whitelist
- **Users** — list of HayPlusbot signups, whether they signed disclosure, whether they're HFcopy-subscribed (per HFM API), email verification status. **Far fewer destructive actions than v2.2** — there's no license to suspend or revoke in the bot sense. Admin can delete a user account (GDPR request, abuse, etc.) and can manually mark someone as subscribed/unsubscribed for support cases.
- **Signal audit** — full forensic trail of every A+ evaluation
- **HFM sync** — API health, sync status, manual triggers
- **Revenue** — HFcopy performance fees (primary) and IB rebates (secondary) with monthly breakdown, top-contributor tables
- **System** — kill switches (global bot pause, disable new signups, maintenance mode), feature flags, admin user management, audit log viewer

**Audit logging is preserved.** Every destructive admin action writes to `admin_action_log` before execution. The list of destructive actions shrinks in v3 (no per-user license actions) but the mechanism stays identical to v2.2.

Admin dashboard remains desktop-only (1024px+). Same middleware pattern — `/admin/*` routes return 404 for non-admins.

## 11. Tech stack

### Frontend
- Next.js 14 App Router, TypeScript, Tailwind CSS
- shadcn/ui, Framer Motion, Lightweight Charts, Recharts

### Backend
- Next.js API routes, Server Actions
- Supabase (Postgres + Auth + Edge Functions + Realtime + Storage)
- Resend for transactional email

### Bot worker
- Node.js + TypeScript, long-running, deployed on Railway
- MetaAPI.cloud for master account MT5 connection (one persistent session)
- Deterministic SMC/ICT engine per SKILL.md

### External APIs
- **HFM Partner API** (wrapped behind BrokerProvider) — IB tracking, account verification
- **HFM HFcopy API** — master strategy subscriber count, aggregate metrics
- **MetaAPI.cloud** — MT5 for master account only
- **Trading Economics** — economic calendar
- **Finnhub** — FX quotes, DXY, news
- **Anthropic API** — Claude Haiku for sentiment and narratives

### Removed from v2.2 stack
- Twilio (no phone verification in v3)
- Per-user MetaAPI subscriptions (now one connection only)
- Stripe (no payments — same as v2.2)
- Phone verification infrastructure

### Infrastructure
- Vercel, Supabase, Railway, Cloudflare, Sentry, PostHog, Better Stack

**Estimated fixed infra cost at launch: ~$100-130/month** (lower than v2.2's $150-200 because MetaAPI cost is now flat at one account rather than scaling with user count).

## 12. Database schema

Significantly simpler than v2.2.

### Tables retained (from v2.2) with modifications

**user_profiles** — same structure. Phone fields removed.

**signups** (replaces v2.2's `user_licenses`) — much simpler:
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK auth.users | |
| email | text | |
| country_code | text | ISO-2 |
| signed_up_at | timestamptz | |
| risk_disclosure_signed_at | timestamptz nullable | |
| risk_disclosure_version | text nullable | |
| risk_disclosure_ip | inet nullable | |
| hfm_account_number | text nullable | provided by user |
| hfm_account_verified_at | timestamptz nullable | when broker-lock verified |
| hfm_account_verified_under_our_code | bool default false | |
| hfcopy_subscribed | bool default false | updated by daily sync |
| hfcopy_subscribed_at | timestamptz nullable | |
| hfcopy_unsubscribed_at | timestamptz nullable | |
| referral_token | text | for HFM attribution |
| utm_source, utm_medium, utm_campaign | text nullable | |

**signals** — same structure as v2.2. The signal engine doesn't change.

**signal_confluence_factors** — same as v2.2.

**trades** — now only records master account trades (not per-user). Simpler FK — points to signals, no user_id column.

**master_account_config** — same as v2.2 (singleton table for master credentials and config).

**master_account_metrics** — same as v2.2 (periodic equity snapshots for public curve).

**hfm_sync_state** — same as v2.2 (caches API pulls).

**market_news_cache**, **news_headlines**, **economic_calendar_cache**, **signal_confluence_factors** — same as v2.2.

**user_settings** — much simpler. Only email/Telegram notification preferences remain. No risk-per-trade, no pair whitelist, no execution mode (those belong to the master, not to users).

**notification_log** — same as v2.2.

**admin_users**, **admin_action_log** — same as v2.2.

**subscribe_balance_check_log** — new in v3.3. Append-only log of every subscribe-time balance check. Columns: `id bigint PK identity`, `user_id uuid FK`, `hfm_account_number text`, `balance_account_currency numeric`, `account_currency text`, `balance_usd_equivalent numeric`, `fx_rate_used numeric`, `passed bool`, `reason_if_failed text`, `checked_at timestamptz default now()`. Postgres trigger raises on UPDATE/DELETE (same pattern as `admin_action_log`). Rate-limited in application code: max 3 attempts per user per 60 seconds. Retained for 90 days for abuse-pattern detection; older rows archived or purged.

### Tables removed from v2.2

- `user_mt5_accounts` — no per-user MT5 credentials
- `activity_log` — no license expiry logic tied to user engagement
- `partnership_check_log` — no daily per-user broker-lock check (single check at subscription time, logged in `signups` directly)
- `funding_check_log` — replaced by `subscribe_balance_check_log` (different purpose and schema)
- `copy_trading_dismissed_by_user` — copy trading IS the product, not a panel to dismiss

### RLS policies
- `signups` — user selects own row only
- `signals`, `trades`, `master_account_metrics`, `signal_confluence_factors`, `market_news_cache`, `news_headlines`, `economic_calendar_cache` — **authenticated-only** read (supports the "content behind disclosure signing" requirement — unauthenticated users see zero data). Actually: signing disclosure happens post-auth, so "read requires (signed_in AND risk_disclosure_signed_at IS NOT NULL)" is the enforcement pattern — implement via RLS function checking the user's signups row.
- `master_account_config`, `hfm_sync_state`, `subscribe_balance_check_log` — service role only
- `admin_users`, `admin_action_log` — service role only (append-only enforcement on admin_action_log preserved)
- `user_settings`, `notification_log` — user selects own only

## 13. Build sequence (revised and shortened)

v3 is materially shorter than v2.2 — estimated 21 prompts across 7 phases.

### Phase 1 — Foundation
**Prompt 1.** Next.js 14 scaffold with TypeScript, Tailwind, shadcn/ui, Supabase client. Directory structure per CLAUDE.md v3.

**Prompt 2.** Supabase schema per Section 12. Much simpler than v2.2's schema. Append-only trigger on `admin_action_log` preserved.

**Prompt 3.** Supabase Auth (email+password only, no phone verification). Login, signup, reset password, middleware protecting `/dashboard`, `/signals`, `/subscribe`, `/settings`. Middleware additionally enforces risk_disclosure_signed_at on all protected routes except `/risk-disclosure` itself.

### Phase 2 — Marketing site
**Prompt 4.** Landing page — hero emphasising copy trading, subscriber count widget (50-user threshold), master account performance summary, how-it-works overview, CTA to sign up.

**Prompt 5.** How-it-works page — deep dive into SMC methodology, subscription mechanism, fee explanation.

**Prompt 6.** FAQ page — v3-specific Q&As.

**Prompt 7.** Commercial transparency page (/how-we-make-money) — 40/60 fee split explanation, IB rebate secondary mention, honest caveats about performance-contingent revenue.

### Phase 3 — Authentication and disclosure
**Prompt 8.** Signup flow — email verification only (no phone). Lands on `/onboarding/disclosure`.

**Prompt 9.** Risk disclosure signing page — full v3 disclosure text, three-checkpoint acknowledgment, scroll-gating, SHA-256 hash, IP capture, PDF generation, email of signed copy.

### Phase 4 — Broker integration
**Prompt 10.** BrokerProvider interface in `lib/brokers/types.ts`. HFM implementation at `lib/brokers/hfm/provider.ts` with mocked responses. Note swap-readiness is preserved — interface methods are deliberately broker-agnostic.

**Prompt 11.** HFM account verification page (part of `/subscribe` flow). User enters HFM account number; backend verifies under partner code; on success, user is redirected to the HFcopy subscription page on HFM. On failure, shows guidance.

**Prompt 11.5.** Subscribe flow with balance verification. Build the subscribe page at `/app/(dashboard)/subscribe/` that integrates with the `BrokerProvider` interface. When user clicks "Open HFcopy subscription →", a Server Action checks the user's HFM account balance via HFM Partner API, converts to USD equivalent via Finnhub FX rate (cached 5 min), compares against the $85 threshold (accommodating 5% buffer on the $90 internal gate). Below $85 → display user-friendly error without exposing internal figure. Above $85 → redirect to HFM's HFcopy subscription URL in new tab. Every attempt logged to `subscribe_balance_check_log` with full state. Rate limit: max 3 attempts per user per 60 seconds. Create the `subscribe_balance_check_log` table as part of this prompt with append-only enforcement (Postgres trigger + RLS). Critical: the $90 and $85 figures never appear in any user-facing message or page source. Only $100 (the public recommended minimum) appears in user-facing content.

**Prompt 12.** Daily HFM sync (Supabase Edge Function, 02:00 UTC). Updates `signups.hfcopy_subscribed` based on HFM's subscriber list. Updates `hfm_sync_state.current_subscribers_count`.

### Phase 5 — Bot worker and master account execution
**Prompt 13.** Bot worker scaffold — heartbeat, graceful shutdown, Sentry.

**Prompt 14.** MetaAPI integration for master account only. Persistent MetaAPI session. Credentials from `master_account_config`.

**Prompt 15.** Market data ingestion across 9 pairs at M5/M15/H1/H4/D1.

**Prompt 16.** Economic calendar poller.

**Prompt 17.** SMC pattern detection engine per SKILL.md.

**Prompt 18.** Confluence scorer per SKILL.md. Handle non-USD crosses (skip DXY filter).

**Prompt 19.** Master account execution logic. Pre-trade validation (session, circuit breakers, fundamental filters). MetaAPI order placement.

**Prompt 20.** News sentiment cron and per-signal narrative generator.

### Phase 6 — User-facing pages
**Prompt 21.** Dashboard page — master account performance, equity curve, open positions (60s delay), recent trades, signal count today.

**Prompt 22.** Signals archive page — historical signals with narratives, filterable.

**Prompt 23.** Subscribe page — HFM account verification + link to HFM's HFcopy subscription page.

**Prompt 24.** Settings page — email preferences, notification channels, subscription status (read-only), delete-account option (soft delete with GDPR/NDPR compliance).

### Phase 7 — Admin and launch
**Prompt 25.** Admin middleware and `is_admin` role check. Admin layout.

**Prompt 26.** Admin dashboard — Overview + Master Account + Users + Signal Audit sections.

**Prompt 27.** Admin HFM Sync + Revenue + System sections. Audit log viewer.

**Prompt 28.** Admin audit logging infrastructure (`logAdminAction()` helper, append-only enforcement tests, typed-confirmation modals for destructive actions).

**Prompt 29.** Legal pages, NDPR-compliant privacy policy, terms. Deploy to Vercel + Railway + Supabase production. Launch monitoring.

Total: **29 prompts** (down from v2.2's 33). Actually only 21 "new" prompts since many are adaptations of v2.2 prompts.

---

## Appendix: Open questions and dependencies

### HFcopy availability per country
Confirm with HFM which countries HFcopy is available in. Affects marketing reach and signup flow geography checks.

### HFM strategy provider subscriber cap
Confirm HFM's subscriber limit per strategy provider account. If low (e.g., 500), this affects scaling assumptions.

### HFM Partner API specifics
- Does the API return each referred user's HFM account number (for pre-subscription broker-lock verification), or do users have to enter their HFM account number and we verify by other means?
- What's the rate limit on the Partner API?
- Is webhook-based push available for subscription state changes, or is polling required?

### HFcopy fee collection timing
When HFM deducts the 40% performance fee from a subscriber's profit, is it per-trade (immediately on each profitable trade close) or periodic (weekly/monthly settlement)? Affects revenue recognition timing on our side.

### Master account starting balance and deposits
Client should specify starting balance and any deposit/withdrawal schedule on the master account. Affects how the public equity curve reads.

### Nigerian solicitor review
Budget ₦300-500k. Specific questions for the solicitor: (a) is operating as an HFM strategy provider sufficient regulatory coverage for Nigerian users, (b) what consumer protection applies to performance-contingent services, (c) how should the 40/60 fee arrangement be represented legally.

### DPIA
Required before processing real user data. Simpler than v2.2's DPIA because we hold less data (no MT5 credentials, no phone numbers).

### Bootstrap admin account
Admin seeding via env var `BOOTSTRAP_ADMIN_EMAIL` on initial migration. Remove env var after first deploy.

### Future broker migration
If we move to Exness Social Trading or similar later: subscribers would need to close HFcopy subscription, open account at new broker, resubscribe via new IB link. A multi-week migration project. BrokerProvider abstraction makes the code-side easier; the user-side is hard regardless.

### Front-running delay tuning
Default 60s on public open positions. Client can adjust.

### Subscriber count display threshold
Default 50 users before counter shows. Client can adjust.
