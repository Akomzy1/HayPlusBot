---
name: smc-aplus-detection
description: "Use this skill when implementing, modifying, or testing HayPlusbot's A+ forex trade setup detection logic. Covers the full pipeline: higher-timeframe bias (D1/H4 BOS), liquidity sweep detection, order block and FVG identification, CHoCH confirmation, 7-factor confluence scoring, and the three fundamental filters (interest rate differential, economic calendar blackout, DXY correlation). Trigger whenever the user works on files under workers/bot/analysis/, asks about SMC pattern detection rules, adjusts confluence thresholds, debates what qualifies as A+, or debugs a signal that fired or failed to fire. This skill is the source of truth for trading logic — refer to it before writing any pattern-detection code."
---

# HayPlusbot — A+ Setup Detection

This skill encodes HayPlusbot's complete A+ setup detection pipeline. Use it whenever you touch trading logic in `workers/bot/analysis/` or need to explain why a specific setup qualified (or didn't).

Every rule here is deterministic. Same inputs must produce same outputs. No randomness, no ML, no LLM judgment in the core pipeline — only in the narrative generation that runs *after* a signal fires.

## Core philosophy

HayPlusbot trades only A+ setups. "A+" has a precise definition: 6 out of 7 technical confluence factors AND all 3 fundamental filters pass. Anything below 6/7 or any failed fundamental filter does not trigger auto-execution.

Expected fire rate: 2-5 A+ setups per week across all six majors combined. If your code is firing more often, something is wrong with the scorer — do not "fix" this by relaxing thresholds.

The product's entire value proposition is restraint. When in doubt, be stricter.

## Pipeline overview

For each monitored pair, on each M15 candle close, run this pipeline:

1. **Establish HTF bias** — check D1 and H4 structural direction
2. **Detect liquidity sweep** — find recent sweeps of recognised reference levels
3. **Detect CHoCH** — confirm change of character on M15 or M5
4. **Find entry zone** — locate unmitigated order block or FVG in the impulse
5. **Score confluence** — evaluate all 7 factors
6. **Apply fundamental filters** — check rates, calendar, DXY
7. **Classify and route** — A+ → auto-execute; A/B → alert only; below → discard

Stop at the first failure. If HTF bias is neutral, no sweep was found, or no CHoCH occurred, the setup is immediately discarded without scoring.

## Step 1: Higher-timeframe bias (D1 / H4)

### Swing identification
A "swing" is a fractal with at least two lower highs on each side (bearish swing high) or two higher lows on each side (bullish swing low).

```typescript
// Canonical signature
function identifySwings(candles: Candle[]): Swing[]
```

Swings are identified on closed candles only. Never on the current forming candle.

### Break of structure (BOS)
- **Bullish BOS:** a candle closes decisively above the most recent confirmed bearish swing high
- **Bearish BOS:** a candle closes decisively below the most recent confirmed bullish swing low

"Decisively" means the close beyond the level exceeds 20% of the prior candle's range. This filters wicks and noise.

### Bias rules
| D1 status | H4 status | Trades allowed |
|-----------|-----------|----------------|
| Bullish BOS | Bullish BOS | Longs only |
| Bearish BOS | Bearish BOS | Shorts only |
| Bullish | Bearish | None (disagreement) |
| Bearish | Bullish | None (disagreement) |
| Ranging (no recent BOS) | Any | None |
| Any | Ranging | None |

Re-evaluate HTF bias every 4 hours, or on-demand when an M15 setup appears to be forming.

## Step 2: Liquidity sweep detection

A liquidity sweep is a brief excursion beyond a reference level that reverses back within a defined window.

### Recognised reference levels (in order of reliability)
1. Previous day's high / low (PDH, PDL)
2. Previous week's high / low (PWH, PWL)
3. Session opening high / low (London or NY open) within current trading day
4. Asian session range extremes (00:00-07:00 GMT)
5. Most recent confirmed H1 swing high / low

### Valid sweep criteria
Price must:
- Trade at least **2 pips** beyond the level (measured from the wick extreme)
- **Close back through** the level within **30 minutes** of the initial breach

Longer excursions, or candles that close beyond the level without reversing, are treated as decisive breaks (not sweeps) and invalidate it as a sweep candidate.

## Step 3: Change of character (CHoCH)

Following a valid sweep, a CHoCH is a break of the most recent M15 swing high (for a long setup) or swing low (for a short setup).

The CHoCH candle must:
- Close beyond the relevant M15 swing
- Occur within **2 hours** of the sweep

If more than 2 hours pass without a CHoCH, the sweep is expired and the setup is abandoned.

## Step 4: Entry zone identification

Once both the sweep and CHoCH are confirmed, find the first unmitigated order block or FVG within the impulse that produced the CHoCH.

### Order block
**Long setup:** the last down-close candle before the bullish impulse. Zone = candle body range (open to close).

**Short setup:** the last up-close candle before the bearish impulse. Zone = candle body range.

**Unmitigated** means price has not returned to the zone since the impulse. Once price wicks into the zone, it's "mitigated" and no longer valid.

### Fair value gap (FVG)
A three-candle pattern where candle 2 has a wick-to-wick gap with candles 1 and 3:
- **Bullish FVG:** low of candle 1 > high of candle 3
- **Bearish FVG:** high of candle 1 < low of candle 3

Zone = the gap itself. Must also be unmitigated.

### Order placement
Place a pending limit order at the **proximal edge** of the entry zone (the edge closest to current price). Stop loss sits at the **distal edge** plus a **5-pip buffer**.

If price doesn't reach the entry zone within **4 hours** of the CHoCH, the pending order is cancelled.

## Step 5: The 7 confluence factors

Each factor is worth 1 point. All must be evaluated in order; none are weighted differently.

### Factor 1: Liquidity sweep confirmed
A valid sweep (per Step 2 rules) of a recognised liquidity pool preceded the CHoCH.

### Factor 2: Unmitigated order block or FVG
The entry zone is a clean, untouched OB or FVG (per Step 4 rules).

### Factor 3: HTF structure aligned
D1 and H4 both confirm the same bias (per Step 1 bias rules).

### Factor 4: Entry in discount / premium zone
**Long setup:** entry sits below the 50% midpoint of the last major D1 swing range (discount zone).

**Short setup:** entry sits above the 50% midpoint (premium zone).

Calculate the midpoint from the most recent D1 swing high and swing low.

### Factor 5: Session alignment
The setup appears during **London session (07:00-10:00 GMT)** or **NY AM (12:30-15:30 GMT)**.

Setups outside these windows automatically fail this factor, even if all other factors pass.

### Factor 6: Previous day's high / low swept
This is **stricter** than Factor 1. Specifically requires:
- **Long setups:** previous day's LOW (PDL) was the level swept
- **Short setups:** previous day's HIGH (PDH) was the level swept

A sweep of any other level (PWH, Asian range, etc.) still counts for Factor 1 but does not award Factor 6.

### Factor 7: Clean impulse from entry zone
The M15 candles creating the CHoCH show strong momentum. Specifically:
- The impulse candles' average **body-to-range ratio must exceed 60%**
- Measured across the 3 candles immediately following entry zone formation

A choppy or wicky impulse fails this factor even if the CHoCH is valid.

## Classification

| Score | Classification | Auto-executes? | Alerts? |
|-------|----------------|----------------|---------|
| 7/7 | A+ | Yes (if mode = auto) | Yes |
| 6/7 | A+ | Yes (if mode = auto) | Yes |
| 5/7 | A | No | Yes |
| 4/7 | B | No | Yes (informational) |
| 3/7 or below | — | No | No, discarded |

**Only A+ (6 or 7 factors) can trigger auto-execution.** A and B setups generate alerts for manual review. Setups scoring 3 or below are not signalled to the user at all.

## Step 6: Fundamental filters

Before any A+ technical setup fires, it must pass all three fundamental filters. Failing any one filter **downgrades the setup to A (alert only)** regardless of technical score.

### Filter 1: Interest rate differential direction
For each pair, maintain the current central bank policy rate for both currencies:

- EUR — ECB deposit facility rate
- USD — Fed funds upper bound
- GBP — BoE bank rate
- JPY — BoJ policy rate
- AUD — RBA cash rate
- CAD — BoC overnight rate
- CHF — SNB policy rate

Rate differential = `base_currency_rate − quote_currency_rate`

- **LONG setup:** differential must be **non-negative** (>= 0)
- **SHORT setup:** differential must be **non-positive** (<= 0)

Rates update on every central bank decision. Run authoritative source check every 24 hours.

### Filter 2: Economic calendar blackout
For **30 minutes before and 30 minutes after** any red-folder event on either currency in the pair, **all new trade execution is blocked**.

Existing positions are not modified — only new entries.

**Red-folder events include:** NFP, CPI, FOMC decisions, ECB/BoE/BoJ rate decisions, GDP, PMI, retail sales.

Calendar polled every 15 minutes for upcoming 24 hours.

### Filter 3: DXY correlation sanity check
If DXY shows a confirmed H4 BOS to the upside within the last 8 hours, **USD-short setups are blocked**:
- No longs on EURUSD, GBPUSD, AUDUSD, NZDUSD
- No shorts on USDJPY, USDCAD, USDCHF

Inverse for DXY bearish breakout.

## Risk management

Not technically part of A+ detection, but the bot must not fire an A+ if risk parameters can't be met.

### SL distance bounds
- **Minimum:** 10 pips (below this, slippage risk on entry/exit is excessive)
- **Maximum:** 50 pips (above this, position sizing becomes too small to matter)

If technical SL falls outside the [10, 50] range, **the setup is skipped entirely** — do not downgrade, do not alert.

### Minimum R:R
A+ qualification requires a minimum **1:3 risk-to-reward ratio** on TP2. If the technical structure doesn't support this, the setup is skipped.

Two-target approach:
- TP1 at **1:2 R:R** — closes 50% of position
- TP2 at **1:5 R:R** — closes remaining 50%, or optionally trails (break-even SL after TP1, then 2×ATR trailing)

### Daily / weekly limits (circuit breakers)
- Maximum **2 A+ setups per calendar day** (UTC)
- Maximum **5 A+ setups per calendar week** (Mon-Sun UTC)
- After **2 consecutive losing trades**, bot pauses until next session boundary
- After **3 losing trades in a single calendar day**, bot pauses until next UTC day

Circuit breaker state is persisted in the database so worker restarts don't reset it.

## Pair whitelist

v1 only trades these six majors:
- EURUSD
- GBPUSD
- USDJPY
- AUDUSD
- USDCAD
- USDCHF

**Do not add pairs without explicit user approval.** Crosses (GBPJPY, EURJPY, AUDJPY) and exotics are v2 backlog.

## Session windows

Only two session windows allow new entries:
- **London session:** 07:00-10:00 GMT
- **NY AM:** 12:30-15:30 GMT

All other periods (Asian, London lunch, NY PM) are no-trade windows. Existing positions remain open and are managed normally; only new entries are blocked.

## Logging requirements

Every signal evaluation — whether it fires or not — must log a full audit trail. This is non-negotiable. We use this for debugging, backtesting, and user trust.

Required fields per evaluation:
- Timestamp (UTC)
- Pair, direction being evaluated
- HTF bias (D1 + H4 state)
- Whether sweep was detected, which level
- Whether CHoCH was detected
- Entry zone type (OB or FVG) and its coordinates
- Each of the 7 confluence factors (awarded or not, with reason if not)
- Each fundamental filter (passed or failed, with details)
- Final classification (A+ / A / B / discarded)
- If discarded, the specific reason
- If fired, the order details (entry, SL, TP1, TP2, lot size, risk amount)

Store in `signals` and `signal_confluence_factors` tables per PRD Section 11.

## Common implementation mistakes to avoid

**Do not evaluate on forming candles.** All swing detection, BOS detection, and confluence factors use closed candles only. The current forming candle is in flux and can give false signals.

**Do not cache HTF bias for too long.** Re-evaluate every 4 hours minimum. A D1 close during the session invalidates prior bias.

**Do not relax the 6/7 threshold.** The whole product depends on the A+ filter being strict. If backtesting shows 6/7 is "too rare," the answer is not to lower the bar — it's to accept that A+ is rare by design.

**Do not substitute different pattern-detection logic.** If you're tempted to add "momentum filters" or "RSI divergence" or any other signal, stop. The A+ definition is frozen. Changes to the methodology require explicit product approval.

**Do not trust timezones.** All times in this logic are UTC. Every timestamp stored in the database is UTC. Every session window is defined in UTC (which happens to equal GMT for London, and is 4-5 hours ahead of EST for NY). Never use local time anywhere in the pipeline.

**Do not assume the bot is stateful.** The worker can restart at any moment (deployment, crash, Railway routing). All state that matters must be in the database. Market data buffers can be rebuilt on startup from the last ~48 hours of broker-feed history.

## Testing scenarios

Canonical test cases every implementation must pass:

1. **Clean A+ long on EURUSD** — D1 bullish BOS, H4 bullish BOS, PDL swept at London open, CHoCH within 45 min, unmitigated OB in discount zone, strong impulse, all fundamentals aligned. Should fire.

2. **A- downgrade from failed fundamental** — same as above but ECB decision scheduled in 15 minutes. Calendar filter fails, classification downgraded to A, alert only.

3. **5/7 A setup** — all technical factors pass except Factor 4 (entry in neutral zone, not discount). Score = 5, classification A, alert only, not auto-executed.

4. **Sweep without CHoCH** — PDL swept but no CHoCH within 2 hours. Setup abandoned, no signal.

5. **Stale bias** — D1 was bullish at last check but a bearish D1 candle closed during the evaluation window. Bias re-evaluation before signal fire rejects the setup.

6. **SL out of bounds** — technical structure would give a 72-pip SL. Setup skipped entirely (not even logged as A/B).

7. **Circuit breaker active** — 2 consecutive losses earlier in the session. Even a valid A+ setup is not executed until next session boundary.

8. **DXY correlation block** — DXY just broke out bullish on H4. EURUSD long setup that would otherwise be A+ is blocked by Filter 3.

9. **Outside session window** — A+ setup forms at 11:15 GMT (London lunch). Factor 5 fails. Classification A at best, alert only.

10. **Mitigated OB** — order block was touched earlier in the session before the CHoCH. Factor 2 fails. Classification cannot reach A+.

Write tests for all ten scenarios before shipping any change to the scorer.

## References

- PRD: `HayPlusbot-PRD-v1.md` Section 8
- Design prompts: `HayPlusbot-Design-Prompts-v1.md` (Prompts 7-8 show how signals are visualised)
- Project instructions: `CLAUDE.md`

If this skill contradicts any of those documents, this skill is the source of truth for trading logic. Bring contradictions to the user's attention immediately.
