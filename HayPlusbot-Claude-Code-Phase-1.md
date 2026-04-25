# HayPlusbot — Claude Code Build Prompts: Phase 1 (Foundation)

**Scope:** Prompts 1-3, covering project scaffold, database schema, and authentication.
**Prerequisites satisfied** (you've confirmed): Supabase account + empty project, Vercel linked to GitHub, Anthropic API key, Node 20+ + pnpm + Git, GitHub repo with CLAUDE.md + PRD + prototypes pushed, Claude Code authenticated.

---

## How to use this document

Each prompt below is self-contained and ready to paste into Claude Code. Between prompts, you'll do some verification steps yourself — those are called out. Do not skip verifications. The cost of running Prompt 2 before Prompt 1 is properly verified is hours of debugging.

**Workflow per prompt:**

1. Open your terminal and `cd` into the HayPlusbot project folder on your machine
2. Run `claude` to start Claude Code in that directory
3. Paste the prompt (the whole thing between the ===== markers)
4. Claude Code will work through the prompt, reading files and writing code. It may ask clarifying questions — answer honestly
5. When Claude Code signals completion, run the verification steps
6. If verification passes, commit and push. If it fails, iterate with Claude Code until it passes
7. Move to the next prompt

**If something breaks mid-prompt:** don't panic. Paste the error output back to Claude Code and ask it to fix. This is normal. Expect 2-4 rounds of iteration per prompt.

---

## Pre-Prompt-1 checklist (30 seconds)

Before pasting Prompt 1, confirm:

```bash
# In your HayPlusbot project folder
ls -la
# You should see: CLAUDE.md, HayPlusbot-PRD-v2.2.md, prototypes/, skills/, .git/

cat CLAUDE.md | head -5
# Should say "HayPlusbot — Claude Code Project Instructions"

cat skills/smc-aplus-detection/SKILL.md | head -3
# Should show the SKILL.md frontmatter
```

If any of these are missing, fix that before running Prompt 1.

Also, gather these environment values (you'll paste them into Claude Code when it asks):

- **Supabase project URL** (from Supabase dashboard → Project Settings → API → Project URL, looks like `https://xxxxx.supabase.co`)
- **Supabase anon key** (same page, "anon / public" key)
- **Supabase service role key** (same page, "service_role" key — treat as SECRET, never commit)
- **Your Anthropic API key** (starts with `sk-ant-...`)

Keep these in a password manager or a scratch note for the session. Claude Code will write them to `.env.local` which is gitignored.

---

## Prompt 1 — Scaffold Next.js 14 project

**What it does:** creates the Next.js 14 App Router project with TypeScript, Tailwind, shadcn/ui, Supabase client, and the directory structure from CLAUDE.md. Sets up environment variables. Installs dependencies.

**Expected duration:** 10-20 minutes (Claude Code + dependency install time).

=====

I'm building HayPlusbot, an AI forex trading bot. You have access to CLAUDE.md at the project root which describes the product, architecture, and conventions. Please read it carefully before acting.

Your task: scaffold the Next.js 14 foundation of this project. Follow the directory structure defined in CLAUDE.md exactly. Do not invent structure that isn't specified there.

Specifically:

1. Initialise a Next.js 14 project using the App Router, TypeScript (strict mode), Tailwind CSS, and ESLint. Use `pnpm` as the package manager, not npm or yarn. The project should be scaffolded in the current directory (do not create a nested subdirectory).

2. Install and configure shadcn/ui. Use the dark mode preset. Run `pnpm dlx shadcn@latest init` with the style "default", base colour "neutral", and CSS variables enabled. Then install these initial components: button, card, input, label, checkbox, dialog, select, toast, form, alert. If the latest shadcn CLI has changed command names, use whatever is current.

3. Install the Supabase client stack: `@supabase/supabase-js` and `@supabase/ssr`. Create `lib/supabase/client.ts` (browser client) and `lib/supabase/server.ts` (server client) following the Supabase SSR docs patterns for Next.js 14 App Router.

4. Install Framer Motion, lucide-react, Zod, date-fns, and the Anthropic SDK (`@anthropic-ai/sdk`).

5. Set up the directory structure exactly as specified in CLAUDE.md. Create all the folders listed there, each with a `.gitkeep` file so they're tracked by git even when empty. This includes: `app/(marketing)/`, `app/(auth)/`, `app/(onboarding)/`, `app/(dashboard)/`, `app/(admin)/`, `components/ui/`, `components/chart/`, `components/signals/`, `components/dashboard/`, `components/marketing/`, `lib/supabase/`, `lib/brokers/`, `lib/brokers/hfm/`, `lib/metaapi/`, `lib/claude/`, `lib/twilio/`, `lib/types/`, `workers/bot/`, `workers/bot/analysis/`, `workers/bot/execution/`, `workers/bot/ai/`, `supabase/migrations/`, `supabase/functions/`, `docs/`, `tests/`.

6. Configure Tailwind with the design tokens from the HayPlusbot design system (referenced in prototypes/p0-design-system.html if it exists). Set up CSS variables for: background base `#0A0B0F`, surface `#12141B`, surface elevated `#1A1D26`, teal `#1D9E75`, coral `#D85A30`, amber `#BA7517`. Configure the two font families: Outfit for UI (from Google Fonts) and JetBrains Mono for numeric (from Google Fonts). Load these fonts via `next/font/google` in the root layout for performance.

7. Create `.env.example` listing every environment variable this project will need, with brief descriptions but no real values. Include: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, METAAPI_TOKEN (future), HFM_PARTNER_API_KEY (future), TWILIO_ACCOUNT_SID (future), TWILIO_AUTH_TOKEN (future), TWILIO_PHONE_NUMBER (future), RESEND_API_KEY (future), FINNHUB_API_KEY (future), TRADING_ECONOMICS_API_KEY (future), BOOTSTRAP_ADMIN_EMAIL (future), PGSODIUM_KEY (future). For the ones marked "future", add a comment `# not needed for Phase 1` so we don't mislead setup.

8. Ask me for the Supabase URL, Supabase anon key, and Anthropic API key, then write them to `.env.local` (which should be gitignored already by Next.js default — verify this).

9. Update the root `layout.tsx` to set dark mode as the default HTML class (not light mode). Import the two Google fonts via next/font/google at the top. Set the metadata (default title "HayPlusbot", description placeholder).

10. Replace the default Next.js home page with a simple placeholder at `app/(marketing)/page.tsx` that shows "HayPlusbot — coming soon" in the brand typography. This is temporary; Prompt 4 in the build sequence will replace it with the real landing page.

11. Add a `.gitignore` that excludes: `node_modules/`, `.next/`, `.env*.local`, `*.log`, `.DS_Store`. Do not exclude the entire `.env.example` file.

12. Update `package.json` scripts to include: `dev` (Next dev on port 3000), `build`, `start`, `lint`, `typecheck` (runs `tsc --noEmit`), `test` (placeholder echo for now — we'll add Vitest later).

Do NOT add at this stage: Vitest, Playwright, the bot worker code, any MetaAPI or HFM or Twilio integration, any database migrations (those come in Prompt 2). Keep Phase 1 focused.

When you're done:
- Run `pnpm typecheck` to verify the scaffold compiles
- Run `pnpm dev` and confirm the placeholder page loads at http://localhost:3000 with the correct fonts and dark background
- Report back with any warnings or errors

Ask me anything you need to know before proceeding. Please do not guess at configuration values.

=====

### Verification steps for Prompt 1

After Claude Code finishes:

```bash
# 1. TypeScript compiles cleanly
pnpm typecheck
# Expected: no errors. Warnings about unused imports are fine.

# 2. Dev server starts and the page loads
pnpm dev
# Open http://localhost:3000 in a browser
# Expected: dark page saying "HayPlusbot — coming soon", in Outfit font

# 3. Directory structure is correct
ls -la lib/supabase/
# Expected: client.ts, server.ts, .gitkeep

# 4. Environment is configured
cat .env.local | grep SUPABASE_URL
# Expected: your actual Supabase URL (do not paste this into a commit message!)

# 5. Nothing secret got committed
git status
# Expected: .env.local should NOT appear in "Changes to be committed"
# If it does: STOP, `git rm --cached .env.local`, add to .gitignore, retry
```

**If verification fails:** paste the failing output back to Claude Code and ask it to fix. Common issues: shadcn CLI version changed, font imports wrong, `.env.local` accidentally staged for commit. All fixable.

**Commit when green:**

```bash
git add .
git commit -m "Phase 1 Prompt 1: Next.js 14 scaffold with Supabase + shadcn/ui"
git push
```

---

## Prompt 2 — Database schema and migrations

**What it does:** creates all Supabase migrations per PRD Section 12, seeds development data for UI testing, and generates the TypeScript types from the schema.

**Expected duration:** 30-60 minutes (schema is substantial; expect iteration on RLS policies).

### Before pasting Prompt 2

Install the Supabase CLI if you haven't:

```bash
# On Windows via npm (easiest)
npm install -g supabase

# Or via the Supabase CLI direct installer
# https://supabase.com/docs/guides/cli/getting-started

supabase --version
# Should show something like 1.x.x or 2.x.x
```

Link your local project to your Supabase project:

```bash
supabase login
# Opens a browser, authenticate

supabase link --project-ref YOUR_PROJECT_REF
# YOUR_PROJECT_REF is the alphanumeric string in your Supabase project URL
# e.g. if your URL is https://abcdefghijk.supabase.co, the ref is abcdefghijk
```

You'll be asked for the database password. This is different from the service role key — it's set when you create the Supabase project. If you didn't save it, reset it from Supabase dashboard → Project Settings → Database.

=====

Task: implement the database schema for HayPlusbot per PRD v2.2 Section 12. Read `HayPlusbot-PRD-v2.2.md` Section 12 ("Database schema") in full before starting. The schema is extensive — do not skip sections.

Specifically:

1. Initialise Supabase migrations in this project using `supabase init` if not already done. Confirm `supabase/config.toml` exists after.

2. Create SQL migration files in `supabase/migrations/`. Use sequential timestamps (Supabase CLI auto-generates these when you run `supabase migration new <name>`). Create separate migrations for each logical group:
   - `00_enums` — all enum types used across tables
   - `01_user_profiles` — user_profiles table extending auth.users
   - `02_user_licenses` — user_licenses table with all v2.1 fields (funding_verified_at, risk_disclosure fields) and v2.2 fields. Status enum: active | suspended | expired | revoked (no pending_purchase — free signup)
   - `03_user_mt5_accounts` — broker-agnostic MT5 credential storage (was exness_accounts in v1)
   - `04_signals` — signal records including confluence score, classification, narratives
   - `05_signal_confluence_factors` — per-factor breakdown for each signal
   - `06_trades` — bot-executed trades
   - `07_activity_log` — engagement signals for inactivity tracking
   - `08_partnership_check_log` — daily broker-lock check outcomes
   - `09_funding_check_log` — v2.1 addition
   - `10_master_account_config` — singleton table for copy trading master
   - `11_hfm_sync_state` — singleton for HFM API cache
   - `12_copy_trading_dismissed_by_user` — tracks panel dismissal
   - `13_market_news_cache` — Claude-generated bias per pair
   - `14_news_headlines` — raw news from API
   - `15_economic_calendar_cache` — upcoming red-folder events
   - `16_user_settings` — per-user preferences
   - `17_notification_log` — outbound alerts with dedupe
   - `18_admin_users` — v2.2 addition for admin role management
   - `19_admin_action_log` — v2.2 addition for audit trail, with append-only enforcement (Postgres trigger raising on UPDATE/DELETE)

3. For each table, implement the columns exactly as specified in PRD Section 12. Do not add columns not specified. Do not omit columns specified. If PRD is ambiguous on a column type, choose the sensible default and add a comment explaining the choice.

4. Implement Row Level Security policies per PRD Section 12's RLS summary:
   - `user_profiles` — user selects/updates their own row only
   - `user_licenses` — user selects their own, no direct insert/update/delete from user (server-managed via service role)
   - `user_mt5_accounts` — user selects their own metadata (investor password never returned to client)
   - `signals`, `signal_confluence_factors`, `market_news_cache`, `news_headlines`, `economic_calendar_cache` — public read (supports the "education, not advice" positioning)
   - `trades`, `activity_log`, `funding_check_log`, `partnership_check_log`, `user_settings`, `notification_log`, `copy_trading_dismissed_by_user` — user selects their own only
   - `master_account_config`, `hfm_sync_state` — service role only, no public or user access
   - `admin_users` — service role only
   - `admin_action_log` — service role INSERT only; no UPDATE or DELETE for any role; users cannot read their own admin action history (this is admin-only visibility)

5. For `admin_action_log`, add a Postgres trigger that RAISES EXCEPTION on any UPDATE or DELETE attempt, regardless of role. This is belt-and-braces alongside the RLS policy. Write a test migration that attempts UPDATE and DELETE and verifies both fail.

6. Install pgsodium for encrypting MT5 investor passwords. Run the relevant `CREATE EXTENSION IF NOT EXISTS` statement. Configure a key ID and note where encrypted columns should use `pgsodium.crypto_aead_det_encrypt`. Specifically for `user_mt5_accounts.investor_password_encrypted` and `master_account_config.mt_investor_password_encrypted`.

7. Create a seed script at `supabase/seed.sql` that populates realistic development data:
   - 1 test user (email test@hayplusbot.local, password set via the CLI later — this just creates the auth row)
   - 1 user_profiles row for that user (name, country NG, phone verified)
   - 1 user_licenses row with status active, funding_verified_at set, risk_disclosure_signed_at set
   - 1 user_mt5_accounts row with a fake account number and encrypted dummy password
   - 30 days of signals (mix of A+, A, B, discarded) distributed realistically across the 6 pairs
   - For each A+ signal, a corresponding trade with realistic entry/exit/pips
   - An activity_log populated consistent with the license being active
   - A master_account_config singleton with fake master credentials
   - An hfm_sync_state singleton with subscribers_count = 147

8. Apply migrations to the linked Supabase project: `supabase db push`. If it fails, iterate.

9. Generate TypeScript types from the schema: `supabase gen types typescript --linked > lib/types/database.ts`. Add a script alias in package.json: `pnpm gen:types`.

10. Verify migrations work by running the seed and querying a few tables via Supabase CLI or the Supabase dashboard SQL editor.

11. Add documentation: in `supabase/README.md`, document how to create new migrations, how to regenerate types, and how to reset + reseed in development.

Do NOT in this prompt: implement any application-level code that uses the schema (that's Prompt 3). Do not implement the admin audit logger helper (that's Prompt 25.6). Do not write data-layer hooks or repository patterns (future prompts).

When you're done:
- Run `pnpm gen:types` and confirm `lib/types/database.ts` is populated with all table types
- Run a `supabase db reset` locally if Supabase is running locally, or verify remote schema matches by spot-checking a few tables in the Supabase dashboard
- Report the list of tables created and any warnings

Ask me anything you need. Do not guess at enum values or column types — all are specified in PRD Section 12.

=====

### Verification steps for Prompt 2

```bash
# 1. Migrations exist
ls supabase/migrations/
# Expected: ~20 numbered SQL files

# 2. Schema applied to Supabase
# Open Supabase dashboard → Table Editor
# Confirm tables exist: user_profiles, user_licenses, signals, trades, admin_users, admin_action_log, etc.

# 3. RLS enabled on tables
# In Supabase dashboard → Authentication → Policies
# Confirm every table has at least one policy. Missing policies are an error.

# 4. TypeScript types generated
cat lib/types/database.ts | head -20
# Expected: auto-generated types for all tables

# 5. Append-only enforcement works
# In Supabase dashboard SQL editor, try:
#   UPDATE admin_action_log SET reason_note = 'hacked' WHERE id = 1;
# Expected: ERROR — raises exception from the trigger.

# 6. TypeScript still compiles
pnpm typecheck
```

**If verification fails:** the most common issue is RLS policies being too restrictive (service role can't do what it needs) or too permissive (users can read things they shouldn't). Paste the failure back to Claude Code. Another common issue is pgsodium extension not being enabled on the Supabase project — you may need to enable it manually via the dashboard.

**Commit when green:**

```bash
git add .
git commit -m "Phase 1 Prompt 2: Database schema with migrations, RLS, pgsodium encryption"
git push
```

---

## Prompt 3 — Authentication (login, signup, reset password)

**What it does:** builds the baseline authentication flows using Supabase Auth — email+password signup, login, password reset, email verification, plus the middleware that protects routes. Does NOT yet include phone verification, broker-lock, risk disclosure, or funding verification (those are Prompts 7-10 in Phase 2).

**Expected duration:** 60-90 minutes.

=====

Task: implement Supabase Auth for HayPlusbot with email+password login, signup, password reset, and email verification. Reference the design prompts in `HayPlusbot-Design-Prompts-v1.md` for visual treatment — specifically the auth-adjacent screens — but remember the full onboarding flow (phone verification, MT5 connection, disclosure, funding) is NOT in scope for this prompt. Just the basic auth flows.

Specifically:

1. Configure Supabase Auth for email+password. In Supabase dashboard, enable email/password auth (likely already on by default). Configure email templates for: confirmation, magic link (optional for now), password reset, email change. Use the default templates with minor branding tweaks — replace "Supabase" with "HayPlusbot" in the subject and body. These templates live in Supabase dashboard → Authentication → Email Templates.

2. Build the middleware at `middleware.ts` (root level). Protect routes matching `/dashboard/*`, `/settings/*`, `/onboarding/*`, and `/admin/*`. Unauthenticated users hitting these routes redirect to `/login`. For `/admin/*`, additionally check the user has an `admin_users` row (not just authenticated) — if not, return a 404 response. Do NOT return 403 — we don't leak the existence of admin routes.

3. Build the login page at `app/(auth)/login/page.tsx`. Use the design tokens set up in Prompt 1. Dark-mode UI, centred card, email and password inputs, a primary "Log in" button, a "Forgot password?" link, and a "Don't have an account? Sign up" link. Use Server Actions (not API routes) to handle submission. Validate with Zod schema. Show errors clearly. After successful login, redirect to `/dashboard`. Use `lib/supabase/server.ts` for the server-side auth call.

4. Build the signup page at `app/(auth)/signup/page.tsx`. Same aesthetic as login. Fields: email, password, password confirmation (client-validated match). On submission, call Supabase `signUp` which sends a verification email. After submission, show a "Check your email" confirmation state rather than redirecting. Include a "Resend verification email" button after a 60-second cooldown.

5. Build the email-verification-landing page at `app/(auth)/verify/page.tsx`. This is where Supabase's email verification link lands. Handle the auth state callback, confirm the user's email, then redirect to `/onboarding` (which will be built in Prompt 7 — for now just show a placeholder "Onboarding flow coming soon").

6. Build the password reset request page at `app/(auth)/reset-password/page.tsx`. Email input, submission calls Supabase `resetPasswordForEmail`. Show confirmation. Build the password reset landing at `app/(auth)/reset-password/confirm/page.tsx` where the email link lands — form with new password + confirmation, submission via Server Action updates the password.

7. Build a logout Server Action in `app/(auth)/actions.ts`. Called from anywhere in the authenticated app.

8. Create `lib/auth/get-user.ts` with helpers: `getCurrentUser()` (returns user from session or null), `requireUser()` (throws if no user — use in protected server components), `requireAdmin()` (throws if user isn't in admin_users — use in admin server components/actions).

9. Update the root layout to read auth state on the server and pass user info into the app (as a prop or via React context if needed for client components).

10. Create one placeholder dashboard page at `app/(dashboard)/page.tsx` — just a "Hello, [user email]" with a logout button. This confirms auth works end-to-end. The real dashboard (with chart, signals, etc.) comes in much later prompts.

11. Accessibility: every form input has a properly associated label. Form errors use `role="alert"` and `aria-live`. Keyboard navigation works. Focus states visible.

12. Test the whole flow manually:
    - Sign up with a real email you can access
    - Receive verification email, click link, land on /verify, redirect to /onboarding placeholder
    - Log out
    - Log in
    - Click "Forgot password", reset, log in with new password
    - Confirm middleware redirects /dashboard to /login when logged out
    - Confirm /admin returns 404 (since no admin_users row exists yet)

Do NOT in this prompt: implement phone verification, the risk disclosure flow, broker-lock, funding verification, the real dashboard UI. Keep this prompt focused on getting the basic auth plumbing working.

When you're done:
- Report the full list of auth routes created
- Confirm manual test pass
- Note any Supabase dashboard configuration changes you made (especially email template edits) so I can verify

Ask me anything you need. In particular, ask me for the exact email address and name you'd like used in the "HayPlusbot" branding in email templates.

=====

### Verification steps for Prompt 3

```bash
# 1. TypeScript compiles
pnpm typecheck

# 2. Dev server runs
pnpm dev

# 3. Manual auth flow test
# Visit http://localhost:3000/signup
# - Sign up with a real email (use a dummy like you+hayplusbot-test@gmail.com if you use Gmail)
# - Expected: confirmation screen
# - Check your inbox, click verification link
# - Expected: lands on /onboarding placeholder (or wherever you set)

# 4. Login works
# Visit /login, log in with same credentials
# Expected: lands on /dashboard placeholder showing your email

# 5. Middleware protects routes
# Open an incognito window, visit http://localhost:3000/dashboard
# Expected: redirect to /login

# 6. Admin route returns 404
# Log in as the test user (not an admin), visit /admin
# Expected: 404 page, NOT a 403 or login redirect

# 7. Logout works
# Click logout on /dashboard
# Expected: redirect to /login, session cleared
```

**If verification fails:** most common issue is email deliverability — Supabase's default email sender may land in spam. Check spam folder. Another common issue is middleware matchers being wrong — if `/dashboard` redirects infinitely, the matcher is misconfigured. Paste the error to Claude Code.

**Commit when green:**

```bash
git add .
git commit -m "Phase 1 Prompt 3: Supabase Auth with login, signup, reset password, middleware"
git push
```

---

## What's next

After Prompts 1-3 are committed and verified, Phase 1 is complete. You'll have:

- A working Next.js 14 scaffold with all v2.2 architectural decisions baked in
- A complete database schema with RLS, append-only audit logging, and encrypted credential storage ready
- Functional auth (signup, login, reset) with role-based route protection

**Next up (Phase 2): marketing site.** Prompts 4-6 will build the landing page, how-it-works page, and FAQ. These reference your prototypes (`prototypes/p1-landing.html`, `p4-how-it-works.html`, `p3-faq.html`) as visual source of truth. If you haven't generated those prototypes yet, do that before Prompt 4.

Let me know when Phase 1 is committed and I'll draft Phase 2.

---

## Troubleshooting: things that commonly go wrong in Phase 1

**shadcn/ui CLI has changed command names again.** If Claude Code fails to install shadcn components, ask it to check the latest shadcn docs — command names shift roughly every 6 months.

**Fonts don't load.** Usually caused by `next/font/google` not being imported in the root layout. The fonts should appear in Chrome DevTools → Network tab when the page loads.

**Supabase migrations fail with "permission denied."** Your Supabase CLI session has expired. Run `supabase login` again.

**RLS policies too restrictive, nothing queryable.** Claude Code sometimes over-applies RLS. If you can't query any table as an authenticated user after Prompt 2, paste the error back and ask it to audit the policies.

**`.env.local` got committed.** `git rm --cached .env.local`, verify `.gitignore` includes it, rotate every key in that file immediately (they're now in git history even if you force-push).

**Claude Code hangs or loops.** Ctrl+C, restart the session, paste your last prompt again with more context about what you see locally.

---

## One final note

Don't try to complete all three prompts in one sitting. Phase 1 comfortably takes a full day with iteration. Prompts 1 and 2 are especially cognitively heavy because they're setting foundations that everything else depends on. Take breaks. Verify as you go. Commit often.

When you're ready for Phase 2, message me and I'll draft Prompts 4-6 calibrated to where the project actually is by then.
