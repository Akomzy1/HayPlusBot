-- signups — replaces v2.2's user_licenses. Free signup model: no status enum,
-- just timestamps and flags. Columns spec'd in PRD v3.3 §12.

create table public.signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  signed_up_at timestamptz not null default now(),

  -- risk disclosure (signed once, see /onboarding/disclosure)
  risk_disclosure_signed_at timestamptz,
  risk_disclosure_version text,
  risk_disclosure_ip inet,

  -- HFM account verification (broker-lock under our IB code)
  hfm_account_number text,
  hfm_account_verified_at timestamptz,
  hfm_account_verified_under_our_code boolean not null default false,

  -- HFcopy subscription state — synced from HFM API daily
  hfcopy_subscribed boolean not null default false,
  hfcopy_subscribed_at timestamptz,
  hfcopy_unsubscribed_at timestamptz,

  -- attribution
  referral_token text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger signups_set_updated_at
  before update on public.signups
  for each row execute function public.set_updated_at();

create index signups_hfm_account_number_idx on public.signups (hfm_account_number);
create index signups_hfcopy_subscribed_idx on public.signups (hfcopy_subscribed)
  where hfcopy_subscribed = true;

alter table public.signups enable row level security;

-- user reads own row only. Writes go through the service role from server actions.
create policy "signups select own"
  on public.signups for select
  to authenticated
  using (user_id = auth.uid());
