-- signals — setups that reached confluence scoring and scored >= 4/7.
-- Lower scores and pre-scoring discards live in signal_evaluations.
-- Retained indefinitely (queryable historical record for /signals archive).

create table public.signals (
  id uuid primary key default gen_random_uuid(),
  pair pair not null,
  direction direction not null,
  evaluated_at timestamptz not null default now(),
  session session_window not null,

  -- HTF bias kept separate per SKILL.md §1
  htf_d1_bias htf_bias not null,
  htf_h4_bias htf_bias not null,

  -- liquidity sweep
  sweep_level_type text,                              -- PDH | PDL | PWH | PWL | asian | h1_swing
  sweep_level_price numeric,

  -- CHoCH
  choch_at timestamptz,

  -- entry zone
  entry_zone_type entry_zone_type,
  entry_zone_proximal numeric,
  entry_zone_distal numeric,

  -- order plan (planned values; actual execution recorded in trades)
  entry_price numeric,
  stop_loss numeric,
  take_profit_1 numeric,
  take_profit_2 numeric,
  risk_pips numeric,
  reward_pips numeric,

  -- scoring
  confluence_score smallint not null check (confluence_score between 4 and 7),
  classification signal_classification not null,

  -- fundamental filters
  filter_1_passed boolean not null,                   -- rate differential
  filter_2_passed boolean not null,                   -- calendar blackout
  filter_3_passed boolean,                            -- DXY (nullable when skipped)
  filter_3_skipped boolean not null default false,    -- true for non-USD crosses

  -- narrative (Claude Haiku output, 2-3 sentences)
  narrative text,
  narrative_generated_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index signals_evaluated_at_idx on public.signals (evaluated_at desc);
create index signals_pair_idx on public.signals (pair, evaluated_at desc);
create index signals_classification_idx on public.signals (classification);

create trigger signals_set_updated_at
  before update on public.signals
  for each row execute function public.set_updated_at();

alter table public.signals enable row level security;

create policy "signals read auth+disclosure"
  on public.signals for select
  to authenticated
  using (public.has_signed_disclosure());
