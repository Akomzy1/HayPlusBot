-- hfm_sync_state — singleton cache of HFM API responses. Avoids hammering
-- HFM rate limits when the dashboard or landing page widgets need data.
-- Daily sync edge function refreshes this; reads come from cache.

create table public.hfm_sync_state (
  id boolean primary key default true,
  subscribers_count integer,
  subscribers_synced_at timestamptz,
  strategy_metrics jsonb,                            -- raw HFcopy API response
  strategy_metrics_synced_at timestamptz,
  last_partner_api_check_at timestamptz,
  last_error text,
  last_error_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint hfm_sync_state_singleton check (id = true)
);

create trigger hfm_sync_state_set_updated_at
  before update on public.hfm_sync_state
  for each row execute function public.set_updated_at();

alter table public.hfm_sync_state enable row level security;
-- RLS enabled with no policies. service_role bypasses RLS, all other roles get
-- zero rows by default. This is intentional for service-role-only tables.
