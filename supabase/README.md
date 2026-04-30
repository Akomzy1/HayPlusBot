# Supabase — schema, migrations, dev workflow

This directory holds HayPlusbot's database schema, edge functions, and dev seed data.

## Layout

```
supabase/
├── config.toml                         CLI configuration (committed)
├── migrations/                         sequential SQL — applied in filename order
├── functions/                          Supabase Edge Functions (daily HFM sync, etc.)
├── seed.sql                            development data, applied on `db reset`
└── .temp/                              CLI scratch (gitignored)
```

## Conventions

- All tables in the `public` schema. All identifiers `snake_case`. All timestamps `timestamptz` (UTC).
- Every user-facing table has RLS enabled. Service role is the only path that bypasses RLS.
- Append-only tables — `signal_evaluations`, `subscribe_balance_check_log`, `admin_action_log` — carry `BEFORE UPDATE/DELETE` triggers that raise. These block even the service role. `admin_action_log` allows one nuanced exception (see [admin_action_log mutability](#admin_action_log-mutability)).
- Singleton tables (`master_account_config`, `hfm_sync_state`) use `id boolean PRIMARY KEY DEFAULT true CHECK (id = true)`.
- Encryption: `master_account_config.mt_investor_password_encrypted` uses `pgsodium.crypto_aead_det_encrypt` with key name `master_account_password`. If pgsodium isn't enabled on the project, the key-creation block in [`20260430120010_master_account_config.sql`](migrations/20260430120010_master_account_config.sql) is a no-op and the column should be migrated to Supabase Vault — flag in PR before doing so.
- "Auth + disclosure-signed" reads use the `public.has_signed_disclosure()` SECURITY DEFINER function to gate access to signals, trades, master_account_metrics, and the news/calendar caches.

## admin_action_log mutability

The pattern in CLAUDE.md is: **log first** (insert with `after_state = null`) → perform action → **update `after_state`**. To support this, the trigger on `admin_action_log` allows exactly one transition: `after_state` from null to non-null. Any other UPDATE or any DELETE raises. Once `after_state` is set, the row is fully immutable.

Test it:

```sql
-- Inside a server action with service_role:
insert into admin_action_log (admin_user_id, action_type, before_state, reason_note)
  values ('<uuid>', 'pause_master', '{"enabled":true}'::jsonb, 'maintenance')
  returning id;        -- captured

-- ... perform the action ...

update admin_action_log
  set after_state = '{"enabled":false}'::jsonb
  where id = <captured_id>;     -- allowed (after_state was null)

update admin_action_log
  set after_state = '{"enabled":true}'::jsonb
  where id = <captured_id>;     -- raises: "after_state already set"

update admin_action_log
  set reason_note = 'tampered'
  where id = <captured_id>;     -- raises: "only after_state may be modified"

delete from admin_action_log
  where id = <captured_id>;     -- raises: "DELETE blocked"
```

## Creating a new migration

```bash
supabase migration new <description>
# Generates supabase/migrations/<UTC_timestamp>_<description>.sql
```

Edit the new file. Migrations apply in lexicographic filename order; **never edit a migration that's already been pushed to remote** — write a follow-up migration to amend.

## Applying migrations to remote

```bash
supabase db push
# Prompts for the database password the first time per session.
# To skip: set $env:SUPABASE_DB_PASSWORD = "..." in your shell.
```

The CLI compares your local `migrations/` against the remote `supabase_migrations.schema_migrations` table and applies anything new, in order.

## Regenerating TypeScript types

After any schema change:

```bash
pnpm gen:types
# Wraps: supabase gen types typescript --linked > lib/types/database.ts
```

Commit `lib/types/database.ts` alongside the migration that changed the schema. App code imports `Database` and `Tables<'signals'>` etc. from this file.

## Resetting + reseeding (local dev only)

If you have Supabase running locally via `supabase start`:

```bash
supabase db reset
# Drops local DB, replays all migrations from scratch, applies seed.sql
```

**Never run `db reset` against the linked remote project — it wipes data.**

The seed creates:
- 1 test user (`test@hayplusbot.local` / `TestPassword123!`)
- 1 signups row (active, disclosure-signed, HFcopy-subscribed)
- master_account_config singleton with placeholder encrypted password
- hfm_sync_state singleton with `subscribers_count = 147`
- 30 days of master_account_metrics
- ~1620 signal_evaluations across 9 pairs
- ~15 signals with their confluence_factor breakdowns
- ~5 trades (one per A+ signal in last 14 days)
- A handful of news_headlines, market_news_cache, economic_calendar_cache rows
