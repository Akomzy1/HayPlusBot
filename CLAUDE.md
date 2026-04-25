# HayPlusbot — Claude Code Project Instructions

**Product:** HayPlusbot — managed copy-trading strategy on HFM's HFcopy platform
**Owner:** Tokunbo (AkomzyAi Consulting) — building for Nigerian client (the client is the strategy provider)
**Jurisdiction:** Nigeria (client-side); users global, subject to HFM's geographic reach
**Stack:** Next.js 14 App Router · Supabase · MetaAPI.cloud · Claude API · TypeScript

You are the engineering assistant for HayPlusbot. This document is your baseline context for every session. Read it before writing any code.

**Companion documents (reference when specifically relevant):**

- `HayPlusbot-PRD.md` — complete product specification (v3.3)
- `HayPlusbot-Risk-Disclosure.md` — live subscriber risk acknowledgment (v3.3)
- `HayPlusbot-Design-Prompts.md` — consolidated design prompt library, all prompts ready to paste into claude.ai
- `HayPlusbot-Claude-Code-Phase-1.md` — Phase 1 Claude Code build prompts (scaffold, schema, auth)
- `prototypes/` — visual reference HTML artifacts generated from the design prompts library
- `skills/smc-aplus-detection/SKILL.md` — A+ setup detection skill pack (covers 9 pairs, non-USD cross handling)

**Discard:** anything labelled v1, v2, v2.1, v2.2 (all superseded). Any separate "patch" documents (v3.1, v3.2, v3.3) are also redundant — their contents have been folded into the source documents above.

---

## Core context (what v3 is)

HayPlusbot is a **single-service platform**: users subscribe to a master HFcopy strategy running on the client's HFM account. The master executes A+ setups automatically using a deterministic SMC/ICT engine. HFM's HFcopy infrastructure mirrors the master's trades into subscribers' HFM accounts.

**The user never runs a bot on their own account.** The v2.2 architecture had two execution paths (bot on user account, plus master HFcopy); v3 has only the second. No per-user MT5 credentials. No per-user execution logic. No broker-lock enforcement in the v2.2 sense.

**The website is primarily a marketing and transparency surface.** Authenticated users can view performance, signal history, and methodology — but their actual trading experience happens on HFM, not on HayPlusbot.com.

**Revenue is performance-contingent.** 40% of profits on subscribers' copied trades paid to HayPlusbot via HFM's fee split. 60% stays with subscriber. No monthly fee. No fee on losses. IB rebates on referred users' general trading volume are a secondary line. The client should understand the revenue is volatile and tied to strategy performance.

---

## Product decisions that are settled in v3

Do not re-litigate these:

- **Single service:** HFcopy master strategy subscription. No per-user bot path.
- **Broker:** HFM only at launch. `BrokerProvider` interface preserved for future swap readiness.
- **Pair coverage: 9 pairs** — the six majors (EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF) plus three JPY crosses (GBP/JPY, EUR/JPY, AUD/JPY).
- **Sessions: London (07:00-10:00 GMT), NY AM (12:30-15:30 GMT). No Asian session.**
- **Strategy:** deterministic SMC/ICT per SKILL.md. 7-factor confluence + 3 fundamental filters. A+ = 6/7 plus all fundamentals. DXY filter skipped on non-USD crosses.
- **Pricing: free signup.** Revenue via HFM's 40/60 HFcopy fee split. No Stripe. No monthly or one-off fees on HayPlusbot.
- **Email verification only.** No phone verification (removed from v2.2).
- **Mandatory IB referral for HFcopy subscription.** Users whose HFM accounts aren't under our partner code cannot subscribe.
- **Risk disclosure signing is mandatory before any product content is viewable.** Unsigned users see blocked content with a "Sign the disclosure to continue" modal.
- **Subscribe balance gate (two-tier).** Public recommendation: $100 USD equivalent minimum (shown on subscribe page as friendly guidance). Internal hard gate: $90 USD equivalent (enforced via HFM Partner API balance check + Finnhub FX conversion, before allowing HFcopy subscription handoff). 5% fluctuation buffer means users at $85+ pass; below $85 block. The $10 gap between public recommendation and internal gate accommodates FX movement between funding and verification. Error messages and all user-facing content reference only $100. The $90 and $85 figures are internal and must never appear in user-facing text, page source, or logs visible to end users. Check runs once at subscription time; no ongoing post-activation enforcement.
- **Dashboard is authenticated + disclosure-signed.** Landing, FAQ, how-it-works, commercial-transparency, risk-disclosure-view pages are public. Everything else requires signed-in and disclosure-signed.
- **Subscriber count public on landing page once above 50.** Below 50, hidden.
- **60-second delay on public open positions** (anti-front-running).
- **Admin dashboard at `/admin/*`.** `is_admin` role check. Non-admins get 404. Desktop-only (1024px+).
- **Admin action audit logging is non-negotiable.** Every destructive action writes to `admin_action_log` BEFORE the action executes. Append-only. Trigger raises on UPDATE/DELETE. Typed confirmation on high-impact actions.
- **Dark mode only.** Mobile-responsive web app. No native apps. No PWA (optional future).

---

## Architecture at a glance

Three deployed components (same as v2.2, but simpler because of single execution path):

1. **Next.js app** — public marketing, authenticated dashboard, admin dashboard, API routes. Vercel.
2. **Bot worker** — long-running Node process running the master account. Railway.
3. **Supabase** — Postgres, Auth (email+password), Edge Functions (daily HFM sync), Storage (disclosure PDFs).

**Key architectural property of v3:** one MetaAPI session (master account only). The bot worker is no longer multi-tenant. This simplifies session management, reconnection handling, credential storage, and error handling significantly.

---

## Directory structure

```
HayPlusbot/
├── app/
│   ├── (marketing)/              # Landing, how-it-works, FAQ, commercial-transparency
│   ├── (public)/                 # Risk disclosure read-only view
│   ├── (auth)/                   # Login, signup, reset-password
│   ├── (onboarding)/             # Disclosure signing, HFM verification
│   ├── (dashboard)/              # Authenticated user dashboard, signals archive, settings
│   ├── (admin)/                  # Admin dashboard (is_admin required)
│   └── api/                      # API routes (HFM sync webhooks, etc.)
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── chart/                    # Lightweight Charts
│   ├── signals/                  # Signal card variants
│   ├── dashboard/
│   ├── admin/
│   └── marketing/
├── lib/
│   ├── supabase/
│   ├── brokers/                  # Broker-agnostic layer (preserved for future)
│   │   ├── types.ts              # BrokerProvider interface
│   │   └── hfm/                  # HFM implementation
│   │       ├── provider.ts
│   │       ├── partner-client.ts
│   │       └── hfcopy-client.ts
│   ├── metaapi/                  # Master account connection
│   ├── claude/                   # Anthropic SDK helpers
│   ├── auth/                     # Session, requireAuth, requireAdmin, requireDisclosureSigned
│   ├── admin/                    # Audit logging helpers
│   └── types/
├── workers/
│   └── bot/
│       ├── analysis/             # SMC, confluence scorer
│       ├── execution/            # Master account execution (single path)
│       ├── ai/                   # Sentiment, narrative
│       └── index.ts
├── supabase/
│   ├── migrations/
│   └── functions/                # Daily HFM sync
├── prototypes/
├── docs/
├── skills/
│   └── smc-aplus-detection/
└── tests/
```

**Important:** the `lib/brokers/` abstraction is preserved even though HFM is the only current implementation. Do not hardcode HFM references outside `lib/brokers/hfm/`. Use the `BrokerProvider` interface elsewhere. This is not over-engineering — it's accepting minor abstraction cost today to enable easier broker migration in future.

---

## Broker-agnostic design rules (preserved from v2.2)

1. Never import from `lib/brokers/hfm/` anywhere except the provider registration point.
2. Every broker-specific concept has a corresponding method on the `BrokerProvider` interface.
3. UI copy referring to "HFM" should come from a config sourced from the active provider, not be hardcoded in components.
4. When writing tests, use a mock `BrokerProvider`, not a mocked HFM client.
5. If you're unsure whether something is broker-specific or generic, ask.

The `BrokerProvider` interface for v3 is smaller than v2.2's (no per-user MT5 methods) but preserves the same discipline.

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
- Public pages (landing, how-it-works, FAQ, commercial, risk-disclosure-view) require nothing.
- Enforcement in middleware AND in RLS policies (belt-and-braces).

### Data access
- All DB access through typed Supabase clients in `lib/supabase/`.
- Service role key only in bot worker and admin action handlers.
- RLS enforces disclosure-signed access to signals, trades, master_account_metrics.

### Testing
- Vitest for unit tests. Playwright for E2E of signup, disclosure signing, subscription flow.
- SMC pattern detection tests use canonical chart scenarios from SKILL.md, including new non-USD cross tests.
- `BrokerProvider` tests use a mock provider.
- Admin action logging: verify UPDATE and DELETE on `admin_action_log` raise exceptions.

### Admin actions (critical pattern — same as v2.2)

Every destructive admin action follows this exact ordering:

1. `requireAdmin()` — authz check
2. Validate input (Zod)
3. Read current state for audit trail
4. **Log first** via `logAdminAction(...)` — if this fails, abort before acting
5. Perform the action
6. Update audit row's `after_state`
7. Return result

Never skip step 4. Never act-then-log. The audit log is the source of truth — if an action executes but the log fails, that's worse than the action not happening at all.

The list of destructive actions in v3 is shorter than v2.2 (no per-user license management). Covered: pausing/resuming master bot, closing master positions, changing master risk/pairs, adding/removing admin users, global kill switches, manually marking a user subscription for support cases.

### Balance verification pattern (subscribe flow, v3.3)

Implemented in `lib/brokers/hfm/partner-client.ts` as a method exposed through the `BrokerProvider` interface.

The flow when user clicks "Subscribe" on the subscribe page:

1. Server Action validates user is authenticated + disclosure signed
2. Server Action calls `BrokerProvider.getAccountBalance(hfmAccountNumber)`
3. Convert balance to USD via Finnhub FX rate (cached 5 minutes)
4. Compare USD-equivalent against $85 threshold (accommodates the 5% buffer on the $90 hard gate)
5. If below $85: return structured error, subscribe action blocks, user remains on page
6. If $85 or above: proceed to HFcopy subscription handoff (external redirect to HFM)
7. Log every check to `subscribe_balance_check_log` table with outcome and exact balance

**Never display the $90 or $85 figure in error messages.** Error text is user-friendly: "Your HFM account balance is below the minimum required for reliable copy trading. We recommend at least $100 USD equivalent." The internal gate is internal — log it server-side, never echo it to client.

Rate-limit per-user: max 3 attempts per 60 seconds to prevent API abuse while users adjust their funding.

The `subscribe_balance_check_log` table follows the same append-only pattern as `admin_action_log` — Postgres trigger raises on UPDATE/DELETE, RLS enforces service-role-only access. Unlike `admin_action_log`, this log is retained for 90 days then archived/purged (it's operational, not audit).

---

## Trading logic

Same SMC/ICT methodology as v2.2. SKILL.md is authoritative.

**Small v3 adjustments:**
- **9 pairs instead of 6** (added GBP/JPY, EUR/JPY, AUD/JPY)
- **DXY filter (Fundamental Filter 3) is skipped on non-USD crosses.** For GBP/JPY, EUR/JPY, AUD/JPY setups, pass Fundamental Filters 1 (rate differential — still applicable using the pair's two currencies) and 2 (calendar — still applicable for either currency in the pair). Filter 3 is not applicable.
- **Expected signal frequency:** 3-7 A+ signals per week. Slightly higher than v2.2 due to broader pair coverage.

**The engine runs once on the master account.** There's no dual-destination execution anymore. One MetaAPI call per signal. HFM handles all mirroring.

Circuit breakers apply to the master account only: 2 A+ trades/day, 5/week, pause after 2 consecutive losses or 3 daily losses.

---

## UI fidelity

Prototypes in `prototypes/` are the visual source of truth. Two fonts total: Outfit for body/headings, JetBrains Mono for all numbers.

v3 has a different set of prototypes from v2.2. Some v2.2 prototypes are retired (license state screens, copy trading marketing panel, funding required page, multi-step onboarding). New prototypes replace them. See `HayPlusbot-Design-Prompts-v3-Updates.md` for the complete mapping.

---

## Security

- All secrets in env vars. Never committed.
- Master account MT5 investor password encrypted with pgsodium in `master_account_config`.
- HFM Partner API key, MetaAPI token, Anthropic API key, Resend key — env vars.
- Client-side never sees server-side secrets.

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

**Proceed** when implementing per PRD v3, running a build sequence prompt, matching a prototype, writing tests, fixing identified bugs.

**Ask before** changing architectural decisions, adding external dependencies, deviating from prototypes, modifying A+ rules, relaxing disclosure-gating, breaking broker-agnostic discipline.

---

## Operational notes

### Build sequence
PRD v3 Section 13 has 29 prompts across 7 phases (down from v2.2's 33).

### Database migrations
Sequential numbered files in `supabase/migrations/`. Never edit deployed migrations.

### Rate limits
- **Anthropic API:** Haiku for sentiment and narrative. Cache aggressively.
- **MetaAPI.cloud:** one account subscription, fixed cost.
- **HFM Partner API:** exponential backoff on 429.
- **Finnhub:** free tier sufficient for the 9-pair monitoring plus DXY.
- **Trading Economics:** paid tier, 15-min polling.

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

HayPlusbot v3 is simpler than v2.2 in almost every dimension: simpler database, simpler onboarding, simpler execution path, simpler infrastructure footprint, simpler support burden. This simplicity is the point. Resist adding complexity.

The product's value proposition is: "an authorised HFM strategy provider running disciplined SMC/ICT setups; subscribe via HFcopy, receive 60% of profits, no upfront cost." That's the whole product. If you catch yourself adding features that require extensive explanation, pull back.
