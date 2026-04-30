-- ============================================================================
-- HayPlusbot — development seed data.
--
-- Applied automatically by `supabase db reset` (local) or via:
--   psql $DATABASE_URL -f supabase/seed.sql
--
-- DO NOT run this against a production project.
--
-- Conventions:
--   * fixed UUIDs (1111…, 2222…) so dev data is reproducible across resets
--   * timestamps are seeded relative to now() so the 30-day window is always recent
--   * realistic SMC field values; not statistically significant — just enough to
--     verify queries work and the dashboard renders something other than empty
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 1. Test user (auth.users)
-- -----------------------------------------------------------------------------

-- email: test@hayplusbot.local
-- password: TestPassword123!
-- Reset/replace via the Supabase auth admin API in real projects; this is just
-- the minimum row needed for downstream FKs in dev.

insert into auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, last_sign_in_at,
  confirmation_token, recovery_token,
  email_change, email_change_token_new
) values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test@hayplusbot.local',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now() - interval '40 days', now(), now() - interval '1 hour',
  '', '', '', ''
) on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 2. user_profiles
-- -----------------------------------------------------------------------------

insert into public.user_profiles (id, display_name, country_code) values
  ('11111111-1111-1111-1111-111111111111', 'Test User', 'NG')
on conflict (id) do update
  set display_name = excluded.display_name,
      country_code = excluded.country_code;

-- -----------------------------------------------------------------------------
-- 3. signups (active, disclosure-signed, HFcopy-subscribed)
-- -----------------------------------------------------------------------------

insert into public.signups (
  id, user_id, email, country_code, signed_up_at,
  risk_disclosure_signed_at, risk_disclosure_version, risk_disclosure_ip,
  hfm_account_number, hfm_account_verified_at, hfm_account_verified_under_our_code,
  hfcopy_subscribed, hfcopy_subscribed_at,
  referral_token, utm_source, utm_medium, utm_campaign
) values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'test@hayplusbot.local', 'NG',
  now() - interval '40 days',
  now() - interval '38 days', '3.3', '127.0.0.1',
  'HFM-TEST-12345', now() - interval '35 days', true,
  true, now() - interval '30 days',
  'haytest', 'organic', 'direct', 'launch'
) on conflict (user_id) do nothing;

-- -----------------------------------------------------------------------------
-- 4. user_settings
-- -----------------------------------------------------------------------------

insert into public.user_settings (user_id) values
  ('11111111-1111-1111-1111-111111111111')
on conflict (user_id) do nothing;

-- -----------------------------------------------------------------------------
-- 5. master_account_config (singleton)
-- -----------------------------------------------------------------------------

insert into public.master_account_config (
  id, account_number, mt_investor_password_encrypted,
  broker_name, metaapi_account_id, enabled, risk_per_trade
) values (
  true, 'HFM-MASTER-9999', decode('deadbeefcafebabe', 'hex'),
  'hfm', 'metaapi-fake-account-id', true, 0.01
) on conflict (id) do update
  set account_number = excluded.account_number;

-- -----------------------------------------------------------------------------
-- 6. hfm_sync_state (singleton)
-- -----------------------------------------------------------------------------

insert into public.hfm_sync_state (
  id, subscribers_count, subscribers_synced_at,
  strategy_metrics, strategy_metrics_synced_at
) values (
  true, 147, now() - interval '5 minutes',
  '{"win_rate":0.62,"avg_rr":2.4,"total_pips_30d":312,"max_drawdown_pct":4.8}'::jsonb,
  now() - interval '5 minutes'
) on conflict (id) do update
  set subscribers_count = excluded.subscribers_count,
      subscribers_synced_at = excluded.subscribers_synced_at,
      strategy_metrics = excluded.strategy_metrics,
      strategy_metrics_synced_at = excluded.strategy_metrics_synced_at;

-- -----------------------------------------------------------------------------
-- 7. master_account_metrics — equity snapshots over the last 30 days
-- -----------------------------------------------------------------------------

insert into public.master_account_metrics (captured_at, equity, balance, floating_pnl, open_positions_count)
select
  now() - (interval '1 hour' * h),
  10000 + (random() * 800 - 200) + (h * 2.5),
  10000 + (h * 2.5),
  random() * 200 - 50,
  case when random() < 0.3 then 1 else 0 end
from generate_series(0, 30 * 24, 6) h;

-- -----------------------------------------------------------------------------
-- 8. signal_evaluations — every M15 eval over last 30 days, 9 pairs
--    (capped: ~6 evals per pair per day = ~1620 rows; sufficient for forensics demo)
-- -----------------------------------------------------------------------------

insert into public.signal_evaluations (
  pair, direction, evaluated_at,
  htf_d1_bias, htf_h4_bias, passed_htf_bias,
  sweep_detected, choch_detected, reached_scoring,
  confluence_score, classification, discard_reason
)
select
  p::pair,
  case when random() < 0.5 then 'long'::direction else 'short'::direction end,
  (now() - (interval '1 day' * d) - (interval '1 hour' * h))::timestamptz,
  case when random() < 0.4 then 'bullish'::htf_bias when random() < 0.7 then 'bearish'::htf_bias else 'ranging'::htf_bias end,
  case when random() < 0.4 then 'bullish'::htf_bias when random() < 0.7 then 'bearish'::htf_bias else 'ranging'::htf_bias end,
  random() < 0.5,
  random() < 0.3,
  random() < 0.2,
  random() < 0.1,
  case when random() < 0.05 then 7 when random() < 0.15 then 6 when random() < 0.3 then 5 else (floor(random()*5))::smallint end,
  case
    when random() < 0.05 then 'a_plus'::signal_classification
    when random() < 0.10 then 'a'::signal_classification
    when random() < 0.20 then 'b'::signal_classification
    else 'discarded'::signal_classification
  end,
  case when random() < 0.5 then 'htf_disagreement' else null end
from
  unnest(array['EUR/USD','GBP/USD','USD/JPY','AUD/USD','USD/CAD','USD/CHF','GBP/JPY','EUR/JPY','AUD/JPY']::text[]) p,
  generate_series(1, 30) d,
  generate_series(0, 5) h;

-- -----------------------------------------------------------------------------
-- 9. signals (mix of A+, A, B over last 30 days; ~15 rows)
-- -----------------------------------------------------------------------------

with seeded_signals as (
  select
    gen_random_uuid() as id,
    p as pair,
    case when n % 2 = 0 then 'long'::direction else 'short'::direction end as direction,
    (now() - (interval '1 day' * (30 - n)))::timestamptz as evaluated_at,
    case when extract(hour from (now() - (interval '1 day' * (30 - n)))) < 12 then 'london'::session_window else 'ny_am'::session_window end as session,
    'bullish'::htf_bias as htf_d1_bias,
    'bullish'::htf_bias as htf_h4_bias,
    n,
    -- alternate classifications
    case when n % 5 = 0 then 7 when n % 3 = 0 then 6 when n % 4 = 0 then 5 else 4 end as confluence_score,
    case
      when n % 5 = 0 then 'a_plus'::signal_classification
      when n % 3 = 0 then 'a_plus'::signal_classification
      when n % 4 = 0 then 'a'::signal_classification
      else 'b'::signal_classification
    end as classification
  from
    unnest(array['EUR/USD','GBP/USD','USD/JPY','AUD/USD','USD/CAD']::text[]) with ordinality as t(p, idx),
    generate_series(1, 3) n
)
insert into public.signals (
  id, pair, direction, evaluated_at, session,
  htf_d1_bias, htf_h4_bias,
  sweep_level_type, sweep_level_price,
  choch_at,
  entry_zone_type, entry_zone_proximal, entry_zone_distal,
  entry_price, stop_loss, take_profit_1, take_profit_2,
  risk_pips, reward_pips,
  confluence_score, classification,
  filter_1_passed, filter_2_passed, filter_3_passed, filter_3_skipped,
  narrative, narrative_generated_at
)
select
  id, pair::pair, direction, evaluated_at, session,
  htf_d1_bias, htf_h4_bias,
  case when direction = 'long' then 'PDL' else 'PDH' end,
  case when pair = 'USD/JPY' then 156.20 else 1.0830 end + random() * 0.01,
  evaluated_at + interval '45 minutes',
  case when n % 2 = 0 then 'order_block'::entry_zone_type else 'fvg'::entry_zone_type end,
  case when pair = 'USD/JPY' then 156.10 else 1.0820 end,
  case when pair = 'USD/JPY' then 156.05 else 1.0815 end,
  case when pair = 'USD/JPY' then 156.10 else 1.0820 end,
  case when pair = 'USD/JPY' then 155.85 else 1.0795 end,
  case when pair = 'USD/JPY' then 156.40 else 1.0850 end,
  case when pair = 'USD/JPY' then 156.85 else 1.0895 end,
  25, 75,
  confluence_score::smallint, classification,
  true, true, true, false,
  'Setup formed at London open after PDL sweep. CHoCH on M15 confirmed within 45 minutes; entry in unmitigated order block sitting in the discount zone. All fundamental filters aligned.',
  evaluated_at + interval '50 minutes'
from seeded_signals;

-- -----------------------------------------------------------------------------
-- 10. signal_confluence_factors — 7 rows per signal
-- -----------------------------------------------------------------------------

insert into public.signal_confluence_factors (signal_id, factor_number, factor_name, awarded, reason)
select s.id, fn, names[fn],
  case
    when fn <= s.confluence_score then true
    else false
  end,
  case
    when fn <= s.confluence_score then null
    else 'condition not met in this evaluation'
  end
from public.signals s
cross join generate_series(1, 7) fn
cross join (values (
  array[
    'liquidity_sweep_confirmed',
    'unmitigated_zone',
    'htf_structure_aligned',
    'discount_premium_zone',
    'session_alignment',
    'previous_day_high_low_swept',
    'clean_impulse'
  ]
)) names_t(names);

-- -----------------------------------------------------------------------------
-- 11. trades — one per A+ signal in the last 14 days
-- -----------------------------------------------------------------------------

insert into public.trades (
  signal_id, pair, direction,
  entry_price, stop_loss, take_profit_1, take_profit_2,
  lot_size, risk_amount, risk_pct,
  metaapi_order_id, metaapi_position_id,
  entry_at, exit_price, exit_at,
  pips_pnl, pnl_amount, outcome
)
select
  s.id, s.pair, s.direction,
  s.entry_price, s.stop_loss, s.take_profit_1, s.take_profit_2,
  0.10, 100.00, 0.01,
  'order_' || substring(s.id::text from 1 for 8),
  'pos_' || substring(s.id::text from 1 for 8),
  s.evaluated_at + interval '15 minutes',
  case
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 0 then s.stop_loss        -- loss
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 1 then s.take_profit_1    -- partial win
    else s.take_profit_2                                                              -- full win
  end,
  s.evaluated_at + interval '4 hours',
  case
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 0 then -25
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 1 then 50
    else 75
  end,
  case
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 0 then -100
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 1 then 200
    else 350
  end,
  case
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 0 then 'loss'::trade_outcome
    when (extract(epoch from s.evaluated_at)::bigint % 3) = 1 then 'win'::trade_outcome
    else 'win'::trade_outcome
  end
from public.signals s
where s.classification = 'a_plus'
  and s.evaluated_at > now() - interval '14 days';

-- -----------------------------------------------------------------------------
-- 12. news_headlines + market_news_cache + economic_calendar_cache (light)
-- -----------------------------------------------------------------------------

insert into public.news_headlines (source, symbol, headline, url, published_at, raw) values
  ('finnhub', 'USD', 'Fed minutes show no rush to cut rates', 'https://example.test/1', now() - interval '2 hours', '{}'::jsonb),
  ('finnhub', 'EUR', 'ECB officials signal patience on policy easing', 'https://example.test/2', now() - interval '3 hours', '{}'::jsonb),
  ('finnhub', 'GBP', 'UK retail sales surprise to upside', 'https://example.test/3', now() - interval '5 hours', '{}'::jsonb),
  ('finnhub', 'JPY', 'BoJ holds rates, signals data dependency', 'https://example.test/4', now() - interval '6 hours', '{}'::jsonb);

insert into public.market_news_cache (pair, bias, summary, input_hash, generated_at, expires_at) values
  ('EUR/USD', 'bearish', 'Fed minutes leaned hawkish while ECB telegraphs caution. Net dollar bid into US session.', 'seed-eurusd-1', now() - interval '10 minutes', now() + interval '50 minutes'),
  ('GBP/USD', 'bullish', 'UK retail sales beat plus dollar fatigue at session highs. Tactical long bias.', 'seed-gbpusd-1', now() - interval '10 minutes', now() + interval '50 minutes'),
  ('USD/JPY', 'neutral', 'BoJ status quo offset by US yields drift. No directional edge into NY AM.', 'seed-usdjpy-1', now() - interval '10 minutes', now() + interval '50 minutes');

insert into public.economic_calendar_cache (external_id, currency, event_name, importance, scheduled_at, forecast, previous) values
  ('te-1001', 'USD', 'Non-Farm Payrolls', 'high', now() + interval '2 days', '180K', '175K'),
  ('te-1002', 'EUR', 'Eurozone CPI Flash Estimate', 'high', now() + interval '3 days', '2.4%', '2.5%'),
  ('te-1003', 'GBP', 'BoE Rate Decision', 'high', now() + interval '5 days', '5.25%', '5.25%'),
  ('te-1004', 'JPY', 'BoJ Policy Statement', 'high', now() + interval '6 days', null, null);
