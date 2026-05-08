/**
 * Broker abstraction. All broker-specific code lives under lib/brokers/<impl>;
 * everything else in the codebase imports only from this file (the interface)
 * via the factory at lib/brokers/index.ts.
 *
 * In v3.4 with HFM, the only fully-implemented method on the HFM provider is
 * signupUrl(). Other methods throw "not yet implemented" because HFM does not
 * offer a Partner API — those throws are correct behaviour, not bugs. The
 * operational equivalents (account verification, subscriber list reconciliation)
 * happen via manual admin actions.
 */

export interface AccountVerificationResult {
  hfmAccountNumber: string;
  exists: boolean;
  underOurIbCode: boolean;
  ibCode?: string;
  accountStatus: "active" | "suspended" | "closed" | "unknown";
  verifiedAt: Date;
}

export interface MasterStrategyMetrics {
  subscribersCount: number;
  totalMirrorVolumeLifetime: number;
  performanceFees30d: number;
  performanceFeesLifetime: number;
  syncedAt: Date;
}

export interface BrokerProvider {
  /** Provider identifier ("mock", "hfm", etc.) */
  readonly name: string;

  /**
   * Generate the broker signup URL with our IB referral code embedded.
   * Used by the landing page and onboarding flow. The optional
   * `referralToken` lets us track per-user attribution downstream of HFM.
   */
  signupUrl(referralToken?: string): string;

  /**
   * Confirm an HFM account number sits under our IB code.
   * v3.4 with HFM: not implemented (no Partner API). The HFM provider
   * throws; manual reconciliation in /admin/hfm-sync is the substitute.
   */
  verifyAccountUnderPartnerCode(
    hfmAccountNumber: string,
  ): Promise<AccountVerificationResult>;

  /**
   * Aggregate strategy metrics for the public landing/dashboard widgets.
   * v3.4 with HFM: not implemented (no Partner API). Admin manually
   * updates the displayed values via /admin/hfm-sync.
   */
  getMasterStrategyMetrics(): Promise<MasterStrategyMetrics>;

  /**
   * List of HFM account numbers currently subscribed to our HFcopy strategy.
   * v3.4 with HFM: not implemented. Comes from CSV upload at
   * /admin/hfm-sync instead.
   */
  getActiveHfcopySubscribers(): Promise<string[]>;
}
