/**
 * Provider factory. Non-broker code calls `getBrokerProvider()` and works
 * with the returned `BrokerProvider` interface — never imports a concrete
 * implementation directly.
 *
 * The active provider is selected by the `BROKER_PROVIDER` env var. Default
 * is `hfm` for both development and production: this matches production
 * behaviour and surfaces accidental calls to not-yet-implemented HFM methods
 * immediately rather than deferring the failure mode to launch.
 *
 * `mock` is opt-in for specific dev scenarios where you need predictable
 * broker data without external dependencies. Vitest unit tests instantiate
 * `MockBrokerProvider` directly regardless of the env var.
 */

import type { BrokerProvider } from "./types";
import { MockBrokerProvider } from "./mock/provider";

let cachedProvider: BrokerProvider | null = null;

export function getBrokerProvider(): BrokerProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = process.env.BROKER_PROVIDER || "hfm";

  switch (providerName) {
    case "mock":
      cachedProvider = new MockBrokerProvider();
      break;
    case "hfm":
      // Phase 3 Prompt 9 will fill in the HFM provider import.
      // In v3.4 most HFM provider methods will throw "not yet implemented"
      // since HFM has no Partner API — that is correct behaviour, not a bug.
      throw new Error(
        "HFM provider not yet implemented in this codebase. Run Phase 3 Prompt 9 first.",
      );
    default:
      throw new Error(`Unknown broker provider: ${providerName}`);
  }

  return cachedProvider;
}

/**
 * Test-only helper to clear the cached provider between test cases.
 * Not exported as part of the public API surface — only callable from
 * other modules under lib/brokers/.
 */
export function _resetBrokerProviderCache(): void {
  cachedProvider = null;
}

export type {
  BrokerProvider,
  AccountVerificationResult,
  MasterStrategyMetrics,
} from "./types";
