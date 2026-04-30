-- master_account_config — singleton row holding the master account's broker
-- credentials and runtime configuration. Investor password encrypted with
-- pgsodium per CLAUDE.md decision; if pgsodium isn't enabled the column is
-- still bytea and a follow-up migration should switch to Supabase Vault.

create table public.master_account_config (
  id boolean primary key default true,
  account_number text not null,
  mt_investor_password_encrypted bytea,              -- pgsodium.crypto_aead_det_encrypt
  broker_name text not null default 'hfm',
  metaapi_account_id text,
  enabled boolean not null default true,
  paused_at timestamptz,
  pair_whitelist pair[] not null default array[
    'EUR/USD','GBP/USD','USD/JPY','AUD/USD','USD/CAD','USD/CHF',
    'GBP/JPY','EUR/JPY','AUD/JPY'
  ]::pair[],
  risk_per_trade numeric not null default 0.01,      -- 1% default
  circuit_breaker_state jsonb not null default '{}'::jsonb,
  last_modified_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint master_account_config_singleton check (id = true)
);

create trigger master_account_config_set_updated_at
  before update on public.master_account_config
  for each row execute function public.set_updated_at();

-- pgsodium key creation. Skipped silently if pgsodium isn't enabled.
do $$
declare
  ext_present boolean;
begin
  select exists (select 1 from pg_extension where extname = 'pgsodium') into ext_present;
  if not ext_present then
    raise notice 'pgsodium not enabled — skipping key creation. Investor password must be encrypted via Supabase Vault or another mechanism.';
    return;
  end if;
  if not exists (select 1 from pgsodium.valid_key where name = 'master_account_password') then
    perform pgsodium.create_key(name => 'master_account_password');
  end if;
end $$;

alter table public.master_account_config enable row level security;
-- RLS enabled with no policies. service_role bypasses RLS, all other roles get
-- zero rows by default. This is intentional for service-role-only tables.
