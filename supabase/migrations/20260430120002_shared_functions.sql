-- Shared trigger functions used across multiple tables.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Raised by BEFORE UPDATE / BEFORE DELETE triggers on append-only tables.
-- Blocks every role including service_role (the latter normally bypasses RLS,
-- but cannot bypass a row-trigger raise).
create or replace function public.raise_append_only()
returns trigger
language plpgsql
as $$
begin
  raise exception 'append-only table %.%: % blocked',
    tg_table_schema, tg_table_name, tg_op
    using errcode = 'P0001';
end;
$$;
