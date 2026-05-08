/**
 * MockBrokerProvider — deterministic test data for all interface methods.
 *
 * Used as the harness for Vitest unit tests, and as an opt-in dev provider
 * via `BROKER_PROVIDER=mock` when working on flows that would otherwise
 * require HFM access. The runtime default in v3.4 is `hfm` so accidental
 * calls to not-yet-implemented HFM methods surface immediately.
 *
 * Every call logs `[MockBrokerProvider] ...` and simulates 50–200ms of
 * latency to keep behaviour realistic during local development.
 */

import type {
  AccountVerificationResult,
  BrokerProvider,
  MasterStrategyMetrics,
} from "../types";

const MOCK_IB_CODE = "MOCK_IB_CODE";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomLatencyMs(): number {
  return 50 + Math.floor(Math.random() * 150); // 50–199ms
}

export class MockBrokerProvider implements BrokerProvider {
  readonly name = "mock";

  signupUrl(referralToken?: string): string {
    return `https://register.hfm.com/?refid=${MOCK_IB_CODE}&ref=${referralToken ?? ""}`;
  }

  async verifyAccountUnderPartnerCode(
    hfmAccountNumber: string,
  ): Promise<AccountVerificationResult> {
    // eslint-disable-next-line no-console
    console.log(
      `[MockBrokerProvider] verifyAccountUnderPartnerCode("${hfmAccountNumber}")`,
    );
    await delay(randomLatencyMs());

    const firstChar = hfmAccountNumber.charAt(0);

    // "9..." → account doesn't exist
    if (firstChar === "9") {
      return {
        hfmAccountNumber,
        exists: false,
        underOurIbCode: false,
        accountStatus: "unknown",
        verifiedAt: new Date(),
      };
    }

    // "2..." → exists but under a different IB code
    if (firstChar === "2") {
      return {
        hfmAccountNumber,
        exists: true,
        underOurIbCode: false,
        ibCode: "OTHER123",
        accountStatus: "active",
        verifiedAt: new Date(),
      };
    }

    // "1..." (and any other prefix) → default success path
    return {
      hfmAccountNumber,
      exists: true,
      underOurIbCode: true,
      ibCode: MOCK_IB_CODE,
      accountStatus: "active",
      verifiedAt: new Date(),
    };
  }

  async getMasterStrategyMetrics(): Promise<MasterStrategyMetrics> {
    // eslint-disable-next-line no-console
    console.log("[MockBrokerProvider] getMasterStrategyMetrics()");
    await delay(randomLatencyMs());

    // Tip: change `subscribersCount` to 247 manually to test the
    // landing-page subscriber-count widget appearance (50+ threshold).
    return {
      subscribersCount: 0,
      totalMirrorVolumeLifetime: 0,
      performanceFees30d: 0,
      performanceFeesLifetime: 0,
      syncedAt: new Date(),
    };
  }

  async getActiveHfcopySubscribers(): Promise<string[]> {
    // eslint-disable-next-line no-console
    console.log("[MockBrokerProvider] getActiveHfcopySubscribers()");
    await delay(randomLatencyMs());

    // In v3.4 production, this list comes from admin CSV upload, not API.
    // The mock returns empty so consuming code exercises the empty-state path.
    return [];
  }
}
