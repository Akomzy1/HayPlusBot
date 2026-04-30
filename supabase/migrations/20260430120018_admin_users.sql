-- admin_users — promotion table. Presence in this table grants is_admin.
-- Bootstrap admin is seeded via the BOOTSTRAP_ADMIN_EMAIL env var in a later
-- prompt. granted_by is null for the bootstrap admin (self-installed).

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null,
  notes text
);

alter table public.admin_users enable row level security;
-- RLS enabled with no policies. service_role bypasses RLS, all other roles get
-- zero rows by default. This is intentional for service-role-only tables.
