-- Enum types used across HayPlusbot tables.
-- Adding values requires a deliberate ALTER TYPE migration — this is intended
-- friction for architectural decisions (e.g. adding a 10th pair).

do $$ begin
  if not exists (select 1 from pg_type where typname = 'pair') then
    create type pair as enum (
      'EUR/USD','GBP/USD','USD/JPY','AUD/USD','USD/CAD','USD/CHF',
      'GBP/JPY','EUR/JPY','AUD/JPY'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'direction') then
    create type direction as enum ('long','short');
  end if;

  if not exists (select 1 from pg_type where typname = 'htf_bias') then
    create type htf_bias as enum ('bullish','bearish','ranging');
  end if;

  if not exists (select 1 from pg_type where typname = 'entry_zone_type') then
    create type entry_zone_type as enum ('order_block','fvg');
  end if;

  if not exists (select 1 from pg_type where typname = 'session_window') then
    create type session_window as enum ('london','ny_am','outside');
  end if;

  if not exists (select 1 from pg_type where typname = 'signal_classification') then
    create type signal_classification as enum ('a_plus','a','b','discarded');
  end if;

  if not exists (select 1 from pg_type where typname = 'trade_outcome') then
    create type trade_outcome as enum ('win','loss','breakeven','manual_close');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_channel') then
    create type notification_channel as enum ('email','telegram');
  end if;

  if not exists (select 1 from pg_type where typname = 'delivery_status') then
    create type delivery_status as enum ('sent','failed','bounced');
  end if;

  if not exists (select 1 from pg_type where typname = 'news_bias') then
    create type news_bias as enum ('bullish','bearish','neutral');
  end if;

  if not exists (select 1 from pg_type where typname = 'digest_frequency') then
    create type digest_frequency as enum ('instant','daily','weekly');
  end if;

  if not exists (select 1 from pg_type where typname = 'event_importance') then
    create type event_importance as enum ('low','medium','high');
  end if;
end $$;
