# HayPlusbot — Claude Code Project Instructions

**Product:** HayPlusbot — managed copy-trading strategy on HFM's HFcopy platform
**Owner:** Tokunbo (AkomzyAi Consulting) — building for Nigerian client (the client is the strategy provider)
**Jurisdiction:** Nigeria (client-side); users global, subject to HFM's geographic reach
**Stack:** Next.js 14 App Router · Supabase · MetaAPI.cloud · Claude API · TypeScript

You are the engineering assistant for HayPlusbot. This document is your baseline context for every session. Read it before writing any code.

**Companion documents (reference when specifically relevant):**

- `HayPlusbot-PRD.md` — complete product specification (v3.4)
- `HayPlusbot-Risk-Disclosure.md` — live subscriber risk acknowledgment (v3.4)
- `HayPlusbot-Design-Prompts.md` — consolidated design prompt library, all prompts ready to paste into claude.ai
- `HayPlusbot-Claude-Code-Phase-1.md` — Phase 1 Claude Code build prompts (scaffold, schema, auth)
- `HayPlusbot-Claude-Code-Phase-2.md` — Phase 2 Claude Code build prompts (marketing pages)
- `HayPlusbot-Claude-Code-Phase-3.md` — Phase 3 Claude Code build prompts (broker abstraction, subscribe flow, manual reconciliation)
- `prototypes/` — visual reference HTML artifacts generated from the design prompts library
- `skills/smc-aplus-detection/SKILL.md` — A+ setup detection skill pack (covers 9 pairs, non-USD cross handling)

**Discard:** anything labelled v1, v2, v2.1, v2.2 (all superseded). Any separate "patch" documents (v3.1, v3.2, v3.3) are also redundant — their contents have been folded into the source documents above.

---

## What changed in v3.4

HFM confirmed they don't offer a public Partner API. Three v3.3 features that depended on real-time API access are replaced with manual processes:

1. **Account verification under IB code** is now reconciled via daily/weekly admin CSV upload from HFM Partner Area dashboard (instead of real-time API call at subscribe time).
2. **Two-tier balance gate is removed entirely.** $100 USD equivalent is shown as guidance only on the subscribe page. HFM enforces its own minimums on the HFcopy side.
3. **Automated subscriber list sync is replaced** with admin-triggered manual reconciliation via CSV upload action.

The product itself doesn't change. The architecture stays clean. Most of v3.3's code work is preserved. v3.4 is the actual industry pattern — Sonic AI, NEO FX, and similar AI-strategy services on broker copy-trading platforms operate this way.

---

## Core context (what v3.4 is)

HayPlusbot is a **single-service platform**: users subscribe to a master HFcopy strategy running on the client's HFM account. The master executes A+ setups automatically using a deterministic SMC/ICT engine. HFM's HFcopy infrastructure mirrors the master's trades into subscribers' HFM accounts.

**The user never runs a bot on their own account.** No per-user MT5 credentials. No per-user execution logic. No broker-lock enforcement in the v2.2 sense.

**The website is primarily a marketing and transparency surface.** Authenticated users can view performance, signal history, and methodology — but their actual trading experience happens on HFM, not on HayPlusbot.com.

**Revenue is performance-contingent.** 40% of profits on subscribers' copied trades paid to HayPlusbot via HFM's fee split. 60% stays with subscriber. No monthly fee. No fee on losses. IB rebates on referred users' general trading volume are a secondary line. The client should understand the revenue is volatile and tied to strategy performance.

---

## Product decisions that are settled in v3.4

Do not re-litigate these:

- **Single service:** HFcopy master strategy subscription. No per-user bot path.
- **Broker:** HFM only at launch. `BrokerProvider` interface preserved for future swap readiness.
- **Pair coverage: 9 pairs** — the six majors (EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF) plus three JPY crosses (GBP/JPY, EUR/JPY, AUD/JPY).
- **Sessions: London (07:00-10:00 GMT), NY AM (12:30-15:30 GMT). No Asian session.**
- **Strategy:** deterministic SMC/ICT per SKILL.md. 7-factor confluence + 3 fundamental filters. A+ = 6/7 plus all fundamentals. DXY filter skipped on non-USD crosses.
- **Pricing: free signup.** Revenue via HFM's 40/60 HFcopy fee split. No Stripe. No monthly or one-off fees on HayPlusbot.
- **Email verification only.** No phone verification (removed from v2.2).
- **Mandatory IB referral for HFcopy subscription.** Users whose HFM accounts aren't under our partner code cannot meaningfully participate in our strategy economics. Enforcement in v3.4 is via manual reconciliation against HFM Partner Area exports (24-48 hour cycle), not real-time API checks.
- **Risk disclosure signing is mandatory before any product content is viewable.** Unsigned users see blocked content with a "Sign the disclosure to continue" modal.
- **Manual verification of IB code attribution** via daily/weekly admin upload of HFM Partner Area subscriber list. Users self-report their HFM account number; reconciliation marks them verified within 24-48 hours. (Replaces v3.3's real-time API verification — HFM does not offer Partner API access.)
- **No balance gate.** $100 USD equivalent shown as guidance only on subscribe page. HFM enforces own minimums on HFcopy side. (Replaces v3.3's two-tier balance gate — required Partner API access not available.) The `subscribe_balance_check_log` table is preserved in schema unpopulated, in case HFM ever offers Partner API.
- **Subscriber count manually updated by admin** via dashboard. Public threshold of 50 still enforced — widget hidden below 50, displayed above.
- **Dashboard is authenticated + disclosure-signed.** Landing, FAQ, how-it-works, risk-disclosure-view pages are public. Everything else requires signed-in and disclosure-signed.
- **60-second delay on public open positions** (anti-front-running).
- **Admin dashboard at `/admin/*`.** `is_admin` role check. Non-admins get 404. Desktop-only (1024px+).
- **Admin action audit logging is non-negotiable.** Every destructive action — including reconciliation actions and subscriber count updates — writes to `admin_action_log` BEFORE the action executes. Append-only. Trigger raises on UPDATE/DELETE. Typed confirmation on high-impact actions.
- **Dark mode only.** Mobile-responsive web app. No native apps. No PWA (optional future).

---

## Architecture at a glance

Three deployed components:

1. **Next.js app** — public marketing, authenticated dashboard, admin dashboard, API routes. Vercel.
2. **Bot worker** — long-running Node process running the master account. Railway.
3. **Supabase** — Postgres, Auth (email+password), Storage (disclosure PDFs).

(In v3.3 there was a Supabase Edge Function for daily HFM sync. Removed in v3.4 — replaced by admin manual action since HFM has no API to sync against.)

**Key architectural property:** one MetaAPI session (master account only). The bot worker is single-tenant. This simplifies session management, reconnection handling, credential storage, and error handling significantly. MetaAPI connects to HFM's MT5 servers like any standard MT5 client; HFM having no Partner API is irrelevant to the bot worker's operation.

---

## Directory structure

```
HayPlusbot/
├── app/
│   ├── (marketing)/              # Landing, how-it-works, FAQ
│   ├── (public)/                 # Risk disclosure read-only view
│   ├── (auth)/                   # Login, signup, reset-password
│   ├── (onboarding)/             # Disclosure signing, HFM account recording
│   ├── (dashboard)/              # Authenticated user dashboard, signals archive, settings
│   ├── (admin)/                  # Admin dashboard (is_admin required); includes /admin/hfm-sync for CSV reconciliation
│   └── api/                      # API routes (webhooks etc.)
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── chart/                    # Lightweight Charts
│   ├── signals/                  # Signal card variants
│   ├── dashboard/
│   ├── admin/                    # Includes admin/hfm-sync CSV upload UI
│   └── marketing/
├── lib/
│   ├── supabase/
│   ├── brokers/                  # Broker-agnostic layer
│   │   ├── types.ts              # BrokerProvider interface
│   │   ├── index.ts              # Provider factory
│   │   ├── mock/                 # MockBrokerProvider (dev only)
│   │   │   └── provider.ts
│   │   └── hfm/                  # HFM implementation skeleton
│   │       ├── provider.ts       # Most methods throw "not yet implemented" until HFM offers API
│   │       ├── partner-client.ts # Skeleton
│   │       └── hfcopy-client.ts  # Skeleton
│   ├── metaapi/                  # Master account connection
│   ├── claude/                   # Anthropic SDK helpers
│   ├── auth/                     # Session, requireAuth, requireAdmin, requireDisclosureSigned
│   ├── admin/                    # Audit logging helpers, CSV reconciliation logic
│   └── types/
├── workers/
│   └── bot/
│       ├── analysis/             # SMC, confluence scorer
│       ├── execution/            # Master account execution (single path)
│       ├── ai/                   # Sentiment, narrative
│       └── index.ts
├── supabase/
│   └── migrations/
├── prototypes/
├── docs/
├── skills/
│   └── smc-aplus-detection/
└── tests/
```

**Important:** the `lib/brokers/` abstraction is preserved even though HFM is the only current implementation. Do not hardcode HFM references outside `lib/brokers/hfm/`. Use the `BrokerProvider` interface elsewhere. This is not over-engineering — it's accepting minor abstraction cost today to enable easier broker migration in future. In v3.4 the HFM provider's API methods are skeletons (HFM has no API), but the abstraction remains useful for code organisation and for swapping to a different broker if needed.

---

## Broker-agnostic design rules

1. Never import from `lib/brokers/hfm/` anywhere except the provider registration point.
2. Every broker-specific concept has a corresponding method on the `BrokerProvider` interface.
3. UI copy referring to "HFM" should come from a config sourced from the active provider, not be hardcoded in components.
4. When writing tests, use the `MockBrokerProvider`, not a mocked HFM client.
5. The active provider is selected via `BROKER_PROVIDER` env var (`mock` or `hfm`).
6. If you're unsure whether something is broker-specific or generic, ask.

---

## Coding conventions

### TypeScript
- Strict mode. No `any`; use `unknown` and narrow.
- Database types generated via `supabase gen types`.
- Zod validation at all external-input boundaries.

### Next.js
- App Router only.
- Server Components by default. `'use client'` only where genuinely needed.
- Server Actions for mutations unless external service POSTs to us.
- `generateMetadata` per route for SEO.

### Auth and disclosure gating
- All routes under `/dashboard`, `/signals`, `/subscribe`, `/settings` require authenticated AND disclosure-signed.
- `/admin/*` requires authenticated AND `is_admin`.
- `/onboarding/disclosure` requires authenticated only (this is where users sign the disclosure).
- Public pages (landing, how-it-works, FAQ, risk-disclosure-view) require nothing.
- Enforcement in middleware AND in RLS policies (belt-and-braces).

### Data access
- All DB access through typed Supabase clients in `lib/supabase/`.
- Service role key only in bot worker and admin action handlers.
- RLS enforces disclosure-signed access to signals, trades, master_account_metrics.

### Testing
- Vitest for unit tests. Playwright for E2E of signup, disclosure signing, account number recording, admin reconciliation.
- SMC pattern detection tests use canonical chart scenarios from SKILL.md, including non-USD cross tests.
- `BrokerProvider` tests use `MockBrokerProvider`.
- Admin action logging: verify UPDATE and DELETE on `admin_action_log` raise exceptions.
- Admin reconciliation: verify CSV processing produces correct subscribe state transitions.

### Admin actions (critical pattern)

Every destructive admin action follows this exact ordering:

1. `requireAdmin()` — authz check
2. Validate input (Zod)
3. Read current state for audit trail
4. **Log first** via `logAdminAction(...)` — if this fails, abort before acting
5. Perform the action
6. Update audit row's `after_state`
7. Return result

Never skip step 4. Never act-then-log. The audit log is the source of truth — if an action executes but the log fails, that's worse than the action not happening at all.

Destructive actions in v3.4 include: pausing/resuming master bot, closing master positions, changing master risk/pairs, adding/removing admin users, global kill switches, **subscriber CSV reconciliation upload, manual subscriber count update, manually marking a user subscription for support cases.**

### Subscriber reconciliation pattern (v3.4)

Implemented at `/admin/hfm-sync`. Replaces v3.3's automated daily Edge Function.

Flow when admin uploads a CSV from HFM Partner Area:

1. Server Action validates admin
2. Parse CSV via `papaparse` (expected columns: `account_number`, `status`, etc.)
3. Filter to accounts with `status = 'active'`
4. For each `signups` row with a recorded `hfm_account_number`:
   - If account on HFM list AND not yet verified → mark `hfm_account_verified_under_our_code = true`, `hfm_account_verified_at = now()`
   - If account on HFM list AND not yet `hfcopy_subscribed` → mark subscribed, set `hfcopy_subscribed_at`
   - If account NOT on HFM list AND was previously subscribed → mark `hfcopy_subscribed = false`, set `hfcopy_unsubscribed_at`
   - If account NOT on HFM list AND not yet verified → add to "unmatched" list for admin follow-up
5. Log full reconciliation summary to `admin_action_log` with metadata
6. Return summary to admin dashboard for display

**Welcome email trigger** for newly-subscribed users is marked TODO until Phase 7 Resend integration.

The CSV is not stored beyond processing (no PII retention beyond what the reconciliation already updates in `signups`).

---

## Trading logic

Same SMC/ICT methodology as v2.2/v3. SKILL.md is authoritative.

**Key facts:**
- **9 pairs** (added GBP/JPY, EUR/JPY, AUD/JPY in v3)
- **DXY filter (Fundamental Filter 3) is skipped on non-USD crosses.** For GBP/JPY, EUR/JPY, AUD/JPY setups, pass Fundamental Filters 1 and 2 only.
- **Expected signal frequency:** 3-7 A+ signals per week.

**The engine runs once on the master account.** One MetaAPI call per signal. HFM handles all mirroring.

Circuit breakers apply to the master account only: 2 A+ trades/day, 5/week, pause after 2 consecutive losses or 3 daily losses.

---

## UI fidelity

Prototypes in `prototypes/` are the visual source of truth. Two fonts total: Outfit for body/headings, JetBrains Mono for all numbers.

v3.4-specific prototype adjustments:
- p17 (subscribe flow) — no balance error state variant; success message references 24-48 hour verification cycle
- p16 (admin dashboard) — gains "Subscriber Reconciliation" subsection with CSV upload UI

---

## Security

- All secrets in env vars. Never committed.
- Master account MT5 investor password encrypted with pgsodium in `master_account_config`.
- MetaAPI token, Anthropic API key, Resend key — env vars.
- Client-side never sees server-side secrets.
- CSV uploads: validate file size (max 10MB), validate MIME type (text/csv), parse with papaparse's safe defaults.

---

## SEO and GEO

Public marketing pages implement:
- `generateMetadata` per route
- Schema.org JSON-LD (Organization, Service, FAQPage)
- Open Graph and Twitter cards
- Dynamic OG images via Vercel OG
- Semantic HTML with strict heading hierarchy
- FAQ answers as self-contained quotable paragraphs (GEO)

Nigerian SEO: British English spellings (colour, organisation, optimisation). Target keywords include "HFM copy trading", "Nigeria forex copy strategy", "HFcopy Nigeria", "Smart Money Concepts copy trading".

**Authenticated content (signals, trades, dashboard) is not indexed.** Robots noindex on all protected routes.

---

## When to ask, when to proceed

**Proceed** when implementing per PRD v3.4, running a build sequence prompt, matching a prototype, writing tests, fixing identified bugs.

**Ask before** changing architectural decisions, adding external dependencies, deviating from prototypes, modifying A+ rules, relaxing disclosure-gating, breaking broker-agnostic discipline, exposing internal verification mechanics in user-facing copy.

---

## Operational notes

### Build sequence
PRD v3.4 Section 13 has 27 prompts across 6 phases (down from v3.3's 29). Phase 3 has 4 prompts instead of 6 (balance gate removed, sync simplified to admin action).

### Database migrations
Sequential timestamped files in `supabase/migrations/` (Supabase CLI naming convention). Never edit deployed migrations.

### Rate limits
- **Anthropic API:** Haiku for sentiment and narrative. Cache aggressively.
- **MetaAPI.cloud:** one account subscription, fixed cost.
- **Trading Economics:** paid tier, 15-min polling.
- **Finnhub:** free tier sufficient for DXY filter and news.

### Manual operational tasks (v3.4)
Your client commits to roughly 30-60 minutes per week of operational work:
- Daily HFM Partner Area dashboard check (5 min) — they'd do this anyway
- Weekly CSV upload to admin dashboard (5-10 min)
- Periodic subscriber count update (1 min when count changes meaningfully)
- Occasional verification-failed user emails (1-2 per week)

This is not extra work — it's the actual operational reality of being an HFcopy strategy provider.

---

## Useful commands

```bash
pnpm dev                    # Next.js on :3000
pnpm dev:worker             # Bot worker locally
pnpm typecheck
pnpm test
pnpm test:e2e

pnpm supabase start
pnpm supabase db reset
pnpm supabase gen types

vercel
railway up
pnpm supabase db push
```

---

## Final reminder

HayPlusbot v3.4 is simpler than v2.2 in almost every dimension: simpler database, simpler onboarding, simpler execution path, simpler infrastructure footprint, simpler support burden. v3.4 is even slightly simpler than v3.3 because three API-dependent automation features are replaced by manual processes — but the operational burden of those manual processes is small.

The product's value proposition is unchanged: "an authorised HFM strategy provider running disciplined SMC/ICT setups; subscribe via HFcopy, receive 60% of profits, no upfront cost." That's the whole product. If you catch yourself adding features that require extensive explanation, pull back.

The v3.4 architecture is what successful AI-strategy-provider services on broker copy-trading platforms actually use (Sonic AI, NEO FX on TAG Markets/CopyX). It's not a compromise; it's the industry pattern.
