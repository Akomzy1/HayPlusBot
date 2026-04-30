-- has_signed_disclosure() — used by RLS policies on tables that gate content
-- behind disclosure signing. SECURITY DEFINER so authenticated users can
-- query their own signups state via RLS without a circular policy.

create or replace function public.has_signed_disclosure()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1
    from public.signups
    where user_id = auth.uid()
      and risk_disclosure_signed_at is not null
  );
$$;

revoke execute on function public.has_signed_disclosure() from public;
grant execute on function public.has_signed_disclosure() to authenticated, service_role;
