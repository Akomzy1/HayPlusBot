-- user_profiles — extends auth.users with display info.
-- v3.3 retains v2.2's structure but removes phone fields entirely.

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;

create policy "user_profiles select own"
  on public.user_profiles for select
  to authenticated
  using (id = auth.uid());

create policy "user_profiles insert own"
  on public.user_profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "user_profiles update own"
  on public.user_profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
