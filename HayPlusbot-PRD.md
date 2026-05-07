# HayPlusbot — AI Forex Trading Strategy
## Product Requirements Document, v3.4

**Status:** Supersedes all previous versions (v1, v2, v2.1, v2.2, v3, v3.1, v3.2, v3.3)
**Owner:** Tokunbo (AkomzyAi Consulting) on behalf of Nigerian client
**Jurisdiction:** Nigeria (client-side); users global (subject to HFM's geographic availability)
**Last updated:** 2026-05-07

> **v3.4 is a constraint-driven adjustment of v3.3.** HFM has confirmed they do not offer public Partner API services. Three v3.3 features that depended on real-time API access are replaced with manual processes: account verification under IB code (now reconciled via daily/weekly admin CSV upload), the two-tier balance gate (removed entirely; $100 shown as guidance only), and automated subscriber list sync (replaced by admin-triggered manual reconciliation). All other v3.3 architecture is preserved unchanged: single-service HFcopy-only model, 9 pairs, London and NY AM sessions, HFM as broker with `BrokerProvider` interface preserved for future migrations. The product itself is unchanged — only the anti-fraud and operational sync mechanisms have been simplified. This pattern matches how successful AI-strategy-providers operate on broker copy-trading platforms (Sonic AI, NEO FX, etc., on TAG Markets' CopyX). The architecture is no longer a compromise; it's the actual industry pattern.

---

## 1. Product overview

HayPlusbot operates a managed copy-trading strategy on HFM's HFcopy platform. A single master HFM trading account runs an AI-driven SMC/ICT A+ setup engine, executing trades during London and NY AM sessions across 9 forex pairs. Subscribers on HFM mirror the master's trades into their own HFM accounts via HFM's HFcopy infrastructure. HayPlusbot itself is a public-facing brand, website, and strategy-operator — not a SaaS tool the user runs on their account.

**The user journey:**
1. User discovers HayPlusbot via marketing
2. Signs up with email verification only
3. Signs the risk disclosure (required before any product value is visible)
4. Opens an HFM account via HayPlusbot's mandatory IB referral link
5. Self-reports their HFM account number to HayPlusbot
6. Within 24-48 hours, account is verified under our IB code via admin reconciliation against HFM Partner Area's referred-clients list
7. Subscribes to HayPlusbot's master strategy on HFcopy (via HFM's HFcopy interface)
8. Returns periodically to HayPlusbot.com to view signal narratives, master performance, and educational content

No MT5 credentials stored. No per-user bot. No per-user auto-execute logic. The user's relationship is primarily with HFM for account operations, and with HayPlusbot for strategy subscription, educational content, and disclosure records.

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

## 5. Out of scope (v3.4 backlog)

Not in v3.4:

- Per-user MT5 bot execution (the core v2.2 feature — removed in v3, would re-introduce credential storage liability)
- Direct payments on HayPlusbot (no Stripe integration)
- Multi-broker support at launch (HFM-only)
- Asian session coverage (London and NY AM only)
- Exotics and commodity crosses
- Native mobile app (web-only, mobile-responsive)
- User-configurable copy ratios or risk settings on HayPlusbot (all on HFM's side)
- Per-user circuit breakers (no per-user execution to break)
- User-signed auto-execute consent (no user execution to consent to)
- License state machine — active/suspended/expired/revoked concept retired; users are either subscribed (confirmed via daily reconciliation) or not
- **Real-time IB code verification at subscribe time** (removed in v3.4 — HFM has no Partner API; replaced by 24-48 hour reconciliation cycle)
- **Two-tier balance gate** (removed in v3.4 — required API balance check; HFM enforces own minimums on their HFcopy side)
- **Automated subscriber list sync** (removed in v3.4 — required Partner API access; replaced by admin CSV upload action)

## 6. Broker integration (HFM, with broker-agnostic design preserved)

### 6.1 Why we preserve broker-agnosticism

Even though v3.4 is HFM-only at launch, the architecture preserves swap-readiness for one reason: **if HFM ever becomes unworkable** (fee structure changes unfavourably, platform outages, policy changes, subscriber cap reached), the client needs a migration path. Not every broker offers copy-trading, but several do: Exness Social Trading (currently closed to new users), IC Markets ZuluTrade integration, Axi Copy Trading, Pepperstone cTrader Copy. A future migration would require moving subscribers to a different broker's copy platform, which is painful but not architectural.

The `BrokerProvider` interface design from v2.2 stays. It shrinks — methods related to per-user MT5 connection are removed — but the pattern is preserved. In v3.4 the HFM provider's API-dependent methods become TODO placeholders since HFM doesn't expose a Partner API; the abstraction itself is still useful.

### 6.2 The BrokerProvider interface

All broker-specific code lives behind a TypeScript interface:

```typescript
interface BrokerProvider {
  name: string; // 'hfm' | 'mock' | ... (future)
  signupUrl(referralToken?: string): string;
  
  // The following methods are kept in the interface for future broker
  // implementations or future HFM API access. In v3.4 with HFM, these
  // throw "not yet implemented" — the operational equivalents happen
  // via manual admin actions instead.
  verifyAccountUnderPartnerCode(accountNumber: string): Promise<VerificationResult>;
  getCopyTradingSubscriberCount(): Promise<number>;
  getCopyTradingStrategyMetrics(): Promise<StrategyMetrics>;
  getActiveHfcopySubscribers(): Promise<string[]>;
}
```

Methods removed compared to v2.2:
- `connectMT5(credentials)` — no per-user MT5 connection
- `getAccountBalance()` — no per-user balance check needed; balance gate removed entirely

The HFM implementation lives at `lib/brokers/hfm/provider.ts`. Shared types at `lib/brokers/types.ts`.

A `MockBrokerProvider` is built and used during development (Phase 3 Prompt 8). The mock provides deterministic test data for all interface methods, making the rest of the application testable without HFM dependencies.

### 6.3 HFM as the current broker

**HFM does not offer a public Partner API.** This was confirmed with HFM directly. v3.4 routes around this by replacing API-dependent automation with manual admin processes.

**MetaAPI.cloud**: used only for the master account connection — one persistent MetaAPI session. No per-user MetaAPI connections. Infrastructure cost becomes flat regardless of subscriber count. This works regardless of whether HFM offers a Partner API — MetaAPI connects to HFM's MT5 servers like any standard MT5 client.

**Partner referral link:** `https://register.hfm.com/?refid={CLIENT_IB_CODE}` — plug in real code when provided. This is a static URL; no API needed.

**HFM Partner Area dashboard**: your client uses this regularly for their own purposes anyway (tracking referred clients, rebates, HFcopy subscribers). v3.4 leverages this — your client exports the referred-clients CSV from HFM Partner Area periodically and uploads it to HayPlusbot's admin dashboard for reconciliation.

### 6.4 The IB referral requirement (v3.4: manual reconciliation)

**HFcopy subscription requires the user's HFM account to be under our partner code.** Enforcement in v3.4:

1. At signup, users are directed to HFM via the referral link. HFM's onboarding captures the referral attribution.
2. User self-reports their HFM account number on HayPlusbot's `/subscribe` page after opening the HFM account.
3. The system records the claim (`signups.hfm_account_number = X`, `hfm_account_verified_under_our_code = false`).
4. Your client periodically (daily or weekly) exports the referred-clients list from HFM Partner Area dashboard.
5. Your client uploads that CSV via HayPlusbot's admin dashboard at `/admin/hfm-sync`.
6. The system reconciles: users whose claimed account numbers appear on HFM's referred-clients list get marked `hfm_account_verified_under_our_code = true` and `hfcopy_subscribed = true` (if also on HFcopy subscriber list).
7. Users whose claimed accounts don't appear on the referred-clients list get an automated email asking them to either confirm their account or open a new one through the referral link.

Verification typically completes within 24-48 hours of user signup. Users are informed of this timing on the subscribe page.

This is the single commercial-protection mechanism in v3.4. Without it, subscribers could sign up under other IBs and HayPlusbot earns no rebates on their trading volume. The mechanism shifts from real-time blocking (v3.3) to deferred reconciliation (v3.4) — the protection is preserved, just enforced asynchronously.

## 7. Signup and onboarding flow (manual verification)

v3.4's flow is 4 steps, the same as v3.3 but with the verification mechanism changed:

**Step 1 — Email signup.** User enters email on landing page. Receives verification email. Clicks link. Email verified.

**Step 2 — Risk disclosure signing.** Three-checkpoint acknowledgment, scroll-gated. Signed before any product value is visible. SHA-256 document hash, IP capture, PDF generation. Per user's answer to the Q&A in the product planning: **disclosure signing is required before performance data, signal archive, or any substantive content can be viewed**. Unsigned users see a permanent "Sign the disclosure to access this content" modal on any protected page.

**Step 3 — HFM account number recording.** User confirms they've opened an HFM account. If they haven't yet, the page directs them to do so via the IB link. Once they have an HFM account number, they enter it on HayPlusbot. The system records the claim and marks `hfm_account_verified_under_our_code = false`. Success message: "Account number recorded. We'll verify it's under our referral within 24-48 hours via our daily reconciliation. You'll receive an email once confirmed, after which you can complete your HFcopy subscription on HFM's platform."

**Step 4 — HFcopy subscription handoff.** With account number recorded, the user is shown a "Subscribe on HFcopy" page with clear instructions and a deep link to HFM's strategy subscription page. The user can proceed to subscribe on HFM's platform; the actual subscription happens entirely on HFM. Once HFM confirms the subscription via the next admin reconciliation, the user's HayPlusbot account status updates to "subscribed" and they get a welcome email plus access to subscriber-only dashboard features.

**Phone verification is removed.** Email verification alone is sufficient.

**Balance verification at subscribe step is removed** in v3.4. The subscribe page shows "$100 USD equivalent recommended" as guidance for good-faith users funding for the first time. HFM enforces its own minimum deposit on the HFcopy side; users below HFM's threshold get HFM's error directly during HFcopy subscription. No HayPlusbot-side balance check.

**Auto-execute consent is not needed** — no per-user execution.

**Risk disclosure is mandatory before content access.** This is the hard gate between "curious visitor" and "user" in v3.4.

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

### 9.1 What the HayPlusbot site is in v3.4

Primarily a **marketing and transparency site** with a light authentication layer. It is not a trading interface. The user's actual trading experience happens on HFM's platform.

### 9.2 Public pages (unauthenticated)

- **Landing page** (/): hero emphasising copy-trading service, subscriber count widget, master account performance summary, CTAs to sign up
- **How it works** (/how-it-works): explains the strategy, the subscription mechanism, the fee structure
- **FAQ** (/faq): answers common questions about copy trading, HFM, subscription, performance
- **Risk disclosure page** (/risk-disclosure): public read-only version of the disclosure (signing is in the authenticated flow)

(Per v3.2, the "How we make money" page was removed in favour of commercial-silence on marketing surfaces. Fee-related questions are answered in FAQ Q17/Q18 with consent-preserving language directing users to HFM's subscription interface for specifics.)

### 9.3 Authenticated pages (email verified + disclosure signed)

- **Dashboard** (/dashboard): master account performance, recent signals, subscription status (not subscribed | pending verification | verified | subscribed)
- **Signals archive** (/signals): historical A+ signals with narratives, searchable
- **Subscribe page** (/subscribe): HFM account number recording + handoff to HFcopy subscription on HFM's platform
- **Settings** (/settings): email preferences, notification channels (email + optional Telegram), subscription status (read-only, managed on HFM's side)

### 9.4 The subscriber count widget

Displayed prominently on the landing page hero and the public dashboard footer. "247 traders copying HayPlusbot" with a small teal pulsing dot for liveness. **In v3.4, the count is updated manually by your client via admin dashboard** (since no automated sync from HFM API is available). Realistic update cadence: weekly, or whenever the count changes meaningfully.

**Minimum display threshold: hide widget until count reaches 50 real subscribers.** Below 50, the counter creates negative social proof. Above 50, display consistently. Never inflate or synthesise.

### 9.5 Master account performance display

- Equity curve (last 30d / 90d / all) on the dashboard
- 30-day, 90-day, all-time stats: win rate, avg R:R, total pips, max drawdown, Sharpe
- Honest drawdown display — losing months shown clearly, not hidden
- 60-second delay on public "open positions" (anti-front-running) — this persists from v2.2
- Closed trades appear immediately (no delay); open positions delayed

This data comes from the bot worker's MetaAPI connection to the master account, not from HFM's Partner API. So the performance display works regardless of HFM API availability.

### 9.6 Signal archive

Public (within authenticated content) scrolling feed of every A+ signal the engine has fired, with:
- Timestamp, pair, direction, entry/SL/TP, pips, outcome
- Confluence score and factor breakdown (educational)
- Claude-generated narrative (2-3 sentences) explaining why the setup fired
- Filter controls: date range, pair, outcome (winners/losers)

## 10. Admin dashboard

Same basic scope as v3.3, with one additional section critical to v3.4 operations: **Subscriber Reconciliation** (replacing v3.3's automated daily sync).

**Sections:**
- **Overview** — system health, subscriber count, today's signals, today's master account P&L, recent activity feed
- **Master account** — master account state, pause/resume bot, close positions, adjust risk-per-trade, adjust pair whitelist
- **Users** — list of HayPlusbot signups, whether they signed disclosure, whether they're verified under our IB code, whether they're HFcopy-subscribed (per most recent reconciliation), email verification status. Admin can delete a user account (NDPR/GDPR request, abuse) and can manually mark someone as subscribed/unsubscribed for support cases.
- **Signal audit** — full forensic trail of every A+ evaluation
- **HFM Sync (v3.4)** — CSV upload for subscriber reconciliation, manual subscriber count update, last reconciliation summary, unmatched users list with email-action buttons
- **Revenue** — HFcopy performance fees (primary) and IB rebates (secondary) with monthly breakdown, top-contributor tables (informational only — your client tracks earnings on HFM Partner Area)
- **System** — kill switches (global bot pause, disable new signups, maintenance mode), feature flags, admin user management, audit log viewer

**Audit logging is preserved.** Every destructive admin action — including subscriber reconciliation actions and subscriber count updates — writes to `admin_action_log` before execution. This is critical for v3.4 because the reconciliation actions are now manual; the audit trail captures who did what and when.

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
- ~~HFM Partner API~~ — **not available**; v3.4 uses manual reconciliation instead
- **MetaAPI.cloud** — MT5 for master account only
- **Trading Economics** — economic calendar
- **Finnhub** — FX quotes, DXY, news (kept for future use; the balance-check FX conversion need is removed in v3.4 but Finnhub remains useful for DXY filter and news)
- **Anthropic API** — Claude Haiku for sentiment and narratives

### Removed from v2.2 stack
- Twilio (no phone verification)
- Per-user MetaAPI subscriptions (now one connection only)
- Stripe (no payments)

### CSV processing
- **papaparse** — for parsing the HFM Partner Area CSV exports during reconciliation

### Infrastructure
- Vercel, Supabase, Railway, Cloudflare, Sentry, PostHog, Better Stack

**Estimated fixed infra cost at launch: ~$100-130/month** (lower than v2.2's $150-200 because MetaAPI cost is now flat at one account rather than scaling with user count).

## 12. Database schema

Largely unchanged from v3.3. One table preserved but unpopulated.

### Tables retained from v3.3 with modifications

**user_profiles** — same structure. Phone fields removed (since v3).

**signups** — same structure. The fields `hfm_account_verified_at` and `hfm_account_verified_under_our_code` are still present and used, but updated by admin reconciliation action rather than by real-time API call.

**signals** — same structure. The signal engine doesn't change.

**signal_confluence_factors** — same as v3.3.

**trades** — same as v3.3. Records master account trades only (no user_id).

**master_account_config** — same as v3.3. Singleton table for master credentials and config.

**master_account_metrics** — same as v3.3. Periodic equity snapshots populated by bot worker (MetaAPI-driven, doesn't need HFM API).

**hfm_sync_state** — same structure as v3.3. In v3.4, fields are populated manually via admin dashboard rather than automatically. The schema is unchanged.

**market_news_cache**, **news_headlines**, **economic_calendar_cache** — same as v3.3.

**user_settings** — same as v3.3.

**notification_log** — same as v3.3.

**admin_users**, **admin_action_log** — same as v3.3. The append-only enforcement is critical in v3.4 since admin actions now include reconciliation events that affect commercial state.

**signal_evaluations** (added in earlier v3 work) — every M15 candle evaluation per pair, append-only, 90-day retention. Unchanged.

**subscribe_balance_check_log** — **preserved in schema but unpopulated in v3.4.** The two-tier balance gate is removed, so this table doesn't get rows written. It's kept in case HFM ever offers Partner API access in future and the balance gate becomes implementable. Cost of keeping an empty table is zero; cost of dropping it would be a destructive migration. Leave it.

### Tables removed compared to v2.2

- `user_mt5_accounts` — no per-user MT5 credentials
- `activity_log` — no license expiry logic tied to user engagement
- `partnership_check_log` — no daily per-user broker-lock check
- `funding_check_log` — no funding gate
- `copy_trading_dismissed_by_user` — copy trading IS the product

### RLS policies (unchanged from v3.3)
- `signups` — user selects own row only
- `signals`, `trades`, `master_account_metrics`, `signal_confluence_factors`, `market_news_cache`, `news_headlines`, `economic_calendar_cache` — authenticated AND has_signed_disclosure() for read
- `master_account_config`, `hfm_sync_state`, `subscribe_balance_check_log`, `signal_evaluations` — service role only
- `admin_users`, `admin_action_log` — service role only (append-only enforcement preserved)
- `user_settings`, `notification_log` — user selects own only

## 13. Build sequence (revised for v3.4)

v3.4 is the same length as v3.3 in number of phases, but Phase 3 has 4 prompts instead of 6 because the API-dependent prompts are simplified or dropped.

### Phase 1 — Foundation (3 prompts, unchanged)
**Prompt 1.** Next.js 14 scaffold with TypeScript, Tailwind, shadcn/ui, Supabase client. Directory structure per CLAUDE.md.

**Prompt 2.** Supabase schema per Section 12. Append-only triggers on `admin_action_log`, `signal_evaluations`, `subscribe_balance_check_log` preserved.

**Prompt 3.** Supabase Auth (email+password only, no phone verification). Login, signup, reset password, middleware protecting `/dashboard`, `/signals`, `/subscribe`, `/settings`. Middleware additionally enforces `risk_disclosure_signed_at` on all protected routes except `/onboarding/disclosure` and `/risk-disclosure`.

### Phase 2 — Marketing site (4 prompts, unchanged)
**Prompt 4.** Landing page.
**Prompt 5.** How-it-works page.
**Prompt 6.** FAQ page (24 Q&As across 5 categories; v3.4 wording for Q8 minimum deposit references $100 as recommended only).
**Prompt 7.** Risk disclosure read-only public view.

(Phase 2's "Commercial transparency" page was removed in v3.2 per the commercial-silence policy. Not re-added in v3.4.)

### Phase 3 — Broker integration and subscribe flow (4 prompts in v3.4, down from 6)
**Prompt 8.** BrokerProvider interface + MockBrokerProvider — unchanged from v3.3.

**Prompt 9.** HFMBrokerProvider skeleton — unchanged from v3.3. The interface methods that would call HFM's Partner API throw "not yet implemented" errors. The `signupUrl()` method is fully implemented (just URL construction). Skeleton preserved in case HFM ever offers Partner API.

**Prompt 11 v2 (renumbered, was Prompt 11 in v3.3).** HFM account number recording. Simpler than v3.3's real-time verification. User enters account number; system records claim; verification flag set to false pending reconciliation. Success message references 24-48 hour verification cycle.

**Prompt 12 v2 (renumbered, was Prompt 12 in v3.3).** Admin CSV reconciliation action. Replaces the daily Edge Function. Admin dashboard at `/admin/hfm-sync` accepts CSV upload from HFM Partner Area, reconciles `signups.hfcopy_subscribed` against the uploaded list. Manual subscriber count update. Audit logging.

**Skipped from v3.3 plan:**
- Original Prompt 10 (sync helpers) — not needed; logic moved to admin action
- Original Prompt 11.5 (balance gate) — removed; no balance check in v3.4
- Original Prompt 12 (Edge Function) — replaced by manual admin action

### Phase 4 — Bot worker and master account execution (8 prompts, unchanged)
**Prompt 13.** Bot worker scaffold — heartbeat, graceful shutdown, Sentry.

**Prompt 14.** MetaAPI integration for master account only. Persistent MetaAPI session. Credentials from `master_account_config`.

**Prompt 15.** Market data ingestion across 9 pairs at M5/M15/H1/H4/D1.

**Prompt 16.** Economic calendar poller.

**Prompt 17.** SMC pattern detection engine per SKILL.md.

**Prompt 18.** Confluence scorer per SKILL.md. Handle non-USD crosses (skip DXY filter).

**Prompt 19.** Master account execution logic. Pre-trade validation (session, circuit breakers, fundamental filters). MetaAPI order placement.

**Prompt 20.** News sentiment cron and per-signal narrative generator.

### Phase 5 — User-facing pages (4 prompts, unchanged)
**Prompt 21.** Dashboard page — master account performance, equity curve, open positions (60s delay), recent trades, signal count today.

**Prompt 22.** Signals archive page — historical signals with narratives, filterable.

**Prompt 23.** Subscribe page — HFM account number recording (Prompt 11 v2 above) plus the post-recording handoff page directing to HFcopy.

**Prompt 24.** Settings page — email preferences, notification channels, subscription status (read-only), delete-account option (NDPR/GDPR-compliant soft delete).

### Phase 6 — Admin and launch (5 prompts, slight adjustment)
**Prompt 25.** Admin middleware and `is_admin` role check. Admin layout.

**Prompt 26.** Admin dashboard — Overview + Master Account + Users + Signal Audit sections.

**Prompt 27.** Admin HFM Sync section (CSV reconciliation per Prompt 12 v2 above) + Revenue informational view + System section. Audit log viewer.

**Prompt 28.** Admin audit logging infrastructure (`logAdminAction()` helper, append-only enforcement tests, typed-confirmation modals for destructive actions).

**Prompt 29.** Legal pages, NDPR-compliant privacy policy, terms. Deploy to Vercel + Railway + Supabase production. Launch monitoring.

Total: **27 prompts** in v3.4 (down from 29 in v3.3, due to dropped balance gate and merged sync prompts).

---

## Appendix: Open questions and dependencies

### HFcopy availability per country
Confirm with HFM which countries HFcopy is available in. Affects marketing reach and signup flow geography checks.

### HFM strategy provider authorisation timeline
Confirm with your HFM Partner Manager when strategy provider authorisation is expected to complete. This is the critical-path external dependency for launch. Without authorisation, no master strategy can be operated on HFcopy.

### Cadence of admin reconciliation
Realistic cadence for your client to upload CSV from HFM Partner Area: weekly is recommended; daily is possible but probably overkill. The 24-48 hour user expectation in copy gives you operational flexibility — if your client uploads every other day that satisfies the promise.

### HFcopy fee collection timing
When HFM deducts the 40% performance fee from a subscriber's profit, is it per-trade (immediately on each profitable trade close) or periodic (weekly/monthly settlement)? Affects revenue recognition timing on your client's side. Doesn't affect HayPlusbot architecture — fees are administered by HFM.

### Master account starting balance and deposits
Client should specify starting balance and any deposit/withdrawal schedule on the master account. Affects how the public equity curve reads.

### Nigerian solicitor review
Budget ₦300-500k. Specific questions for the solicitor: (a) is operating as an HFM strategy provider sufficient regulatory coverage for Nigerian users, (b) what consumer protection applies to performance-contingent services, (c) how should the 40/60 fee arrangement be represented legally, (d) does the manual reconciliation pattern (versus real-time verification) create any compliance concerns under NDPR or Nigerian consumer protection.

### DPIA
Required before processing real user data. Simpler than v2.2's DPIA because we hold less data (no MT5 credentials, no phone numbers, no real-time balance data).

### Bootstrap admin account
Admin seeding via env var `BOOTSTRAP_ADMIN_EMAIL` on initial migration. Remove env var after first deploy.

### Future broker migration
If HFM ever becomes unworkable: subscribers would need to close HFcopy subscription, open account at new broker, resubscribe via new IB link. The `BrokerProvider` abstraction makes the code-side easier; the user-side migration is hard regardless.

### Front-running delay tuning
Default 60s on public open positions. Client can adjust.

### Subscriber count display threshold
Default 50 users before counter shows. Client can adjust.

### Future: if HFM offers Partner API
If HFM ever announces a public Partner API in future, the v3.4 architecture supports filling in the `HFMBrokerProvider` skeleton's TODO methods and migrating from manual reconciliation to automated. The `subscribe_balance_check_log` table is preserved against this possibility. Migration path is straightforward — the abstraction was designed for it.
