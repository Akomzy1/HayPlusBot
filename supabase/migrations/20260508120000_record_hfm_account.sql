-- record_hfm_account() — used by the /subscribe Server Action to record a
-- user's claimed HFM account number on their own signups row.
--
-- Why an RPC instead of `update signups ... where user_id = auth.uid()`:
-- the signups table has no per-user UPDATE policy (writes are deliberately
-- locked down to service role / SECURITY DEFINER paths). This function is
-- SECURITY DEFINER so it can update the row, but it only mutates the three
-- hfm_account_* columns and ALWAYS resets verification flags to false. That
-- way an authenticated user cannot escalate their own row state (e.g. flip
-- hfcopy_subscribed=true) — only the columns we explicitly set get touched.
--
-- v3.4: in HFM-without-Partner-API world, verification is a manual admin
-- reconciliation. This function records the claim; admin CSV upload at
-- /admin/hfm-sync flips hfm_account_verified_at + hfm_account_verified_under_our_code.

create or replace function public.record_hfm_account(
  p_account_number text,
  p_server text
) returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  if p_account_number !~ '^\d{8}$' then
    raise exception 'invalid account number format' using errcode = '22023';
  end if;

  if p_server not in ('HFM-Real', 'HFM-Real-Plus', 'HFM-Real-Pro') then
    raise exception 'invalid server' using errcode = '22023';
  end if;

  update public.signups
     set hfm_account_number = p_account_number,
         hfm_account_verified_at = null,
         hfm_account_verified_under_our_code = false
   where user_id = uid;
end;
$$;

revoke execute on function public.record_hfm_account(text, text) from public;
grant execute on function public.record_hfm_account(text, text) to authenticated;
