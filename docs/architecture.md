# HayPlusbot — Architecture

This document captures cross-cutting architectural decisions. Per-prompt deliverables live in their own commits and don't need to be repeated here. Reach for this file when you're trying to answer "why is the codebase shaped this way?"

## Broker integration

### The pattern

All broker-specific code lives under [`lib/brokers/`](../lib/brokers/). Code outside that directory imports only the [`BrokerProvider`](../lib/brokers/types.ts) interface (re-exported from [`lib/brokers/index.ts`](../lib/brokers/index.ts)) and the factory `getBrokerProvider()`. **Concrete implementations are not imported anywhere outside `lib/brokers/`** — this is the only rule that keeps the abstraction load-bearing.

```
lib/brokers/
├── types.ts            BrokerProvider interface + shared types
├── index.ts            Provider factory: returns active impl based on env
├── mock/
│   ├── provider.ts     MockBrokerProvider — test harness + opt-in dev
│   └── provider.test.ts
└── hfm/                HFM provider (Phase 3 Prompt 9 onward)
```

### Why two implementations

**`HfmBrokerProvider`** is the production implementation. In v3.4 only `signupUrl()` is fully implemented because HFM does not offer a Partner API; the other interface methods throw a `not yet implemented` error. Those throws are correct behaviour, not bugs — manual workflows under `/admin/hfm-sync` handle account verification and subscriber-list reconciliation instead.

**`MockBrokerProvider`** is a deterministic test harness. It returns canned data for all interface methods with realistic 50–200ms latency simulation. Vitest unit tests instantiate it directly. It's also available as an opt-in dev provider via the env var when you need predictable broker data without external dependencies.

### Default selection

The runtime default in v3.4 is **`hfm`**, both in development and in production. Setting it to `mock` is opt-in.

| Env value | Behaviour |
|---|---|
| `BROKER_PROVIDER=hfm` *(default)* | Uses `HfmBrokerProvider`. Calls to not-yet-implemented methods throw immediately. |
| `BROKER_PROVIDER=mock` | Uses `MockBrokerProvider`. All methods return canned data. |
| (anything else) | Factory throws `Unknown broker provider: ...`. |

The reason for defaulting to `hfm` in dev (rather than `mock`) is to surface gaps immediately. If the dev environment uses mock, "everything works" until the first production deploy lights up the real HFM gaps; defaulting to hfm makes those gaps visible at the moment they're introduced.

### Switching providers

Edit `.env.local`:

```env
BROKER_PROVIDER=mock   # or "hfm"
```

Restart `pnpm dev`. The factory caches the provider instance, so a hot-reload alone won't pick up an env change.

### Adding a new broker provider

If we ever add a second broker (Exness Social Trading, IC Markets ZuluTrade, etc.):

1. Create `lib/brokers/<name>/provider.ts` implementing `BrokerProvider`.
2. Add the case to the `switch` in [`lib/brokers/index.ts`](../lib/brokers/index.ts).
3. Document the new env value here.
4. Add unit tests under `lib/brokers/<name>/provider.test.ts` mirroring the mock test suite — every method covered.
5. Update the migration story in PRD if production will swap providers (subscribers would need to move accounts).

Methods that don't apply to the new broker should still implement the interface — throw a `not yet implemented` (or `not applicable for <name>`) error. The interface's contract is uniform; throwing communicates "this broker doesn't expose that surface."
