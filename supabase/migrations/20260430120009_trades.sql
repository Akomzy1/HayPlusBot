-- trades — master account executions only (v3 removed per-user trades; HFcopy
-- mirrors automatically). One row per fired A+ signal that reached entry.

create table public.trades (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid not null references public.signals(id) on delete restrict,
  pair pair not null,
  direction direction not null,

  -- order parameters at submission
  entry_price numeric not null,
  stop_loss numeric not null,
  take_profit_1 numeric not null,
  take_profit_2 numeric not null,
  lot_size numeric not null,
  risk_amount numeric not null,                      -- in account currency
  risk_pct numeric,                                  -- e.g. 0.01 for 1%

  -- broker references (forensics: distinguishes submitted limit orders from filled positions)
  metaapi_order_id text,                             -- limit order id at submission
  metaapi_position_id text,                          -- position id once filled

  -- lifecycle
  entry_at timestamptz,                              -- when limit order filled
  exit_price numeric,
  exit_at timestamptz,
  pips_pnl numeric,                                  -- realised pips on close
  pnl_amount numeric,                                -- in account currency
  outcome trade_outcome,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trades_entry_at_idx on public.trades (entry_at desc);
create index trades_signal_id_idx on public.trades (signal_id);
create index trades_outcome_idx on public.trades (outcome);

create trigger trades_set_updated_at
  before update on public.trades
  for each row execute function public.set_updated_at();

alter table public.trades enable row level security;

create policy "trades read auth+disclosure"
  on public.trades for select
  to authenticated
  using (public.has_signed_disclosure());
