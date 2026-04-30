-- user_settings — much simpler in v3. Only notification preferences. v3
-- removed risk-per-trade, pair whitelist, execution mode (those belong on
-- master_account_config, not per-user — there's no per-user execution).

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_notifications_enabled boolean not null default true,
  telegram_notifications_enabled boolean not null default false,
  telegram_chat_id text,
  digest_frequency digest_frequency not null default 'instant',
  updated_at timestamptz not null default now()
);

create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

alter table public.user_settings enable row level security;

create policy "user_settings select own"
  on public.user_settings for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_settings insert own"
  on public.user_settings for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "user_settings update own"
  on public.user_settings for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
