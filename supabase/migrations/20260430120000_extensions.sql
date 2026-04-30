-- Extensions for HayPlusbot.
--
-- pgsodium decision (per CLAUDE.md and PRD v3.3 §12):
-- pgsodium is the chosen mechanism for symmetric encryption of master account
-- credentials. If pgsodium is unavailable on the project (Supabase has been
-- migrating users to Vault), the master_account_config migration's key-creation
-- block becomes a no-op and the column type can be migrated to Vault later.

create extension if not exists pgcrypto;
create extension if not exists pgsodium;
