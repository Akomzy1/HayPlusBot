# HayPlusbot — Claude Code Phase 3 Build Prompts (v3.4)

**Phase 3: Broker abstraction, account number recording, manual reconciliation**

This document contains four ready-to-paste Claude Code prompts. Phase 3 in v3.4 is shorter than v3.3 (4 prompts instead of 6) because HFM has no Partner API — the API-dependent automation is replaced by manual admin processes.

## Context for this phase

HFM has confirmed they don't offer public Partner API services. v3.4 routes around this by:

- Building the `BrokerProvider` abstraction (still useful for future broker migrations, even if API methods are skeletons)
- Building a `MockBrokerProvider` for development testing
- Recording user-claimed HFM account numbers without real-time verification
- Handling subscriber reconciliation via admin CSV upload (replaces v3.3's daily Edge Function)
- Removing the two-tier balance gate entirely (it required Partner API access)

The architecture is no longer a compromise. It's the actual industry pattern for AI-strategy services on broker copy-trading platforms (Sonic AI, NEO FX on TAG Markets/CopyX operate this way).

## Prerequisites before starting

1. **Confirm Phase 1 + Phase 2 are committed.** Phase 3 builds against the schema and auth from Phase 1, and the public marketing pages from Phase 2.

2. **Add broker provider config to `.env.local`:**
   ```
   BROKER_PROVIDER=mock
   HFM_IB_CODE=  # fill in when client provides
   HFM_PARTNER_AREA_URL=https://partners.hfm.com  # informational
   ```

3. **Update `.env.example`** to include the new variables.

4. **No Finnhub needed for Phase 3.** v3.3 needed Finnhub for FX conversion in the balance gate. v3.4 has no balance gate. Finnhub is still useful for DXY filter (Phase 4) but not needed for Phase 3.

## How to use this document

Run prompts one at a time. Each builds on the previous, but each can be reviewed and committed independently.

**Recommended order:**
1. Prompt 8 — BrokerProvider interface + MockBrokerProvider
2. Prompt 9 — HFMBrokerProvider skeleton
3. Prompt 11 v2 — HFM account number recording
4. Prompt 12 v2 — Admin CSV reconciliation

**Estimated total time:** 6-8 hours of focused work across the four prompts.

---

## Prompt 8 — BrokerProvider interface + MockBrokerProvider

```
Build the BrokerProvider interface and a fully functional MockBrokerProvider implementation for HayPlusbot.

## Architecture

HayPlusbot's broker integration is abstracted behind a TypeScript interface so HFM can be supplemented with other brokers in future. Per CLAUDE.md, all broker-specific code lives in `lib/brokers/` and is never imported elsewhere — non-broker code only ever uses the interface.

The active provider is selected at runtime via the `BROKER_PROVIDER` environment variable. For Phase 3, we're using `BROKER_PROVIDER=mock` because HFM has no Partner API. The HFM implementation skeleton comes in Prompt 9 — its methods throw "not yet implemented" errors since there's no API to call. The MockBrokerProvider is what makes the rest of the application testable.

## File structure

```
lib/brokers/
├── types.ts                    # BrokerProvider interface + shared types
├── index.ts                    # Provider factory: returns active impl based on env
├── mock/
│   └── provider.ts             # MockBrokerProvider — fully functional fake
└── hfm/                        # placeholder folder (Prompt 9 fills this in)
    └── .gitkeep
```

## Interface specification

In `lib/brokers/types.ts`, define:

```typescript
// Shared types used by all provider implementations
export interface AccountVerificationResult {
  hfmAccountNumber: string
  exists: boolean
  underOurIbCode: boolean
  ibCode?: string
  accountStatus: 'active' | 'suspended' | 'closed' | 'unknown'
  verifiedAt: Date
}

export interface MasterStrategyMetrics {
  subscribersCount: number
  totalMirrorVolumeLifetime: number
  performanceFees30d: number
  performanceFeesLifetime: number
  syncedAt: Date
}

export interface BrokerProvider {
  /**
   * Provider identifier (mock, hfm, etc.)
   */
  readonly name: string

  /**
   * Generate the broker signup URL with our IB referral code embedded.
   * Used by the landing page and onboarding flow.
   */
  signupUrl(referralToken?: string): string

  /**
   * The following methods exist in the interface for future provider
   * implementations or future API access. In v3.4 with HFM (no Partner API),
   * these throw "not yet implemented" — the operational equivalents
   * happen via manual admin actions instead.
   */
  verifyAccountUnderPartnerCode(
    hfmAccountNumber: string
  ): Promise<AccountVerificationResult>

  getMasterStrategyMetrics(): Promise<MasterStrategyMetrics>

  getActiveHfcopySubscribers(): Promise<string[]>
}
```

## MockBrokerProvider implementation

In `lib/brokers/mock/provider.ts`, build a fully functional implementation:

- Returns realistic, deterministic responses
- Simulates latency (50-200ms per call)
- Logs every call with `[MockBrokerProvider]` prefix

### Behaviour rules:

**`verifyAccountUnderPartnerCode(hfmAccountNumber)`:**
- Account numbers starting with "1" → `exists: true, underOurIbCode: true, accountStatus: 'active'`
- Account numbers starting with "2" → `exists: true, underOurIbCode: false, ibCode: 'OTHER123', accountStatus: 'active'`
- Account numbers starting with "9" → `exists: false, accountStatus: 'unknown'`
- All other prefixes → same as "1" (default to passing)

**`getMasterStrategyMetrics()`:**
- subscribersCount: 0 (will increase to 247 once 50+ threshold met for displays)
- totalMirrorVolumeLifetime: 0
- performanceFees30d: 0
- performanceFeesLifetime: 0
- syncedAt: current timestamp
- Comment explains: change `subscribersCount` to 247 manually for testing the widget appearance

**`getActiveHfcopySubscribers()`:**
- Returns empty array `[]` by default
- Comment explains: in v3.4 production, this list comes from admin CSV upload, not API

**`signupUrl(referralToken)`:**
- Returns `https://register.hfm.com/?refid=MOCK_IB_CODE&ref=${referralToken || ''}`

## Provider factory in `lib/brokers/index.ts`

```typescript
import { BrokerProvider } from './types'
import { MockBrokerProvider } from './mock/provider'

let cachedProvider: BrokerProvider | null = null

export function getBrokerProvider(): BrokerProvider {
  if (cachedProvider) return cachedProvider

  const providerName = process.env.BROKER_PROVIDER || 'mock'

  switch (providerName) {
    case 'mock':
      cachedProvider = new MockBrokerProvider()
      break
    case 'hfm':
      // Phase 3 Prompt 9 will fill in the HFM provider import.
      // Note: HFM provider methods will throw "not yet implemented"
      // since HFM has no Partner API.
      throw new Error(
        'HFM provider not yet implemented. Set BROKER_PROVIDER=mock for now.'
      )
    default:
      throw new Error(`Unknown broker provider: ${providerName}`)
  }

  return cachedProvider
}

export type {
  BrokerProvider,
  AccountVerificationResult,
  MasterStrategyMetrics,
} from './types'
```

## Tests

Add Vitest tests at `lib/brokers/mock/provider.test.ts`:

- `verifyAccountUnderPartnerCode` returns expected results for each prefix pattern
- `getMasterStrategyMetrics` returns the seed values
- `signupUrl` includes the referral token correctly when provided
- All methods complete within reasonable latency bounds (under 500ms in test)

## Documentation

Update `docs/architecture.md` (create if doesn't exist) with a "Broker Integration" section explaining:
- The `BrokerProvider` interface pattern
- Why mock-first is being used in v3.4 (HFM has no Partner API)
- How to swap providers via `BROKER_PROVIDER` env var
- Where to add tests when implementing new providers

## Verification before commit

1. `pnpm typecheck` clean
2. `pnpm test` — broker tests pass
3. `pnpm lint` clean
4. Verify `BROKER_PROVIDER=mock` in `.env.local`
5. Test all account number patterns (starting with 1, 2, 9) produce expected results

## Suggested commit message

feat: Phase 3 Prompt 8 — BrokerProvider interface + MockBrokerProvider

- BrokerProvider interface with 4 methods (signupUrl plus 3 placeholders)
- MockBrokerProvider with deterministic test data and realistic latency
- Provider factory selects active impl via BROKER_PROVIDER env
- Test patterns: account prefixes 1, 2, 9
- Vitest test coverage for all interface methods
- HFM implementation skeleton folder placeholder (filled in Prompt 9)
- Architecture documented in docs/architecture.md
- v3.4: balance check methods removed (no balance gate)
```

---

## Prompt 9 — HFMBrokerProvider skeleton

```
Build the HFMBrokerProvider skeleton in `lib/brokers/hfm/`. HFM does not offer a public Partner API, so the API-dependent methods throw "not yet implemented" errors. The skeleton exists for code organisation discipline and against the possibility that HFM offers an API in future.

## File structure

```
lib/brokers/hfm/
├── provider.ts              # HFMBrokerProvider implementing BrokerProvider
└── README.md                # Setup instructions; documents the no-API constraint
```

## HFMBrokerProvider implementation

In `lib/brokers/hfm/provider.ts`:

```typescript
import { BrokerProvider, AccountVerificationResult, MasterStrategyMetrics } from '../types'

export interface HFMBrokerProviderConfig {
  ibCode: string
}

export class HFMBrokerProvider implements BrokerProvider {
  readonly name = 'hfm'

  constructor(private config: HFMBrokerProviderConfig) {}

  signupUrl(referralToken?: string): string {
    // This method CAN be implemented — just URL construction
    const url = new URL('https://register.hfm.com/')
    url.searchParams.set('refid', this.config.ibCode)
    if (referralToken) {
      url.searchParams.set('ref', referralToken)
    }
    return url.toString()
  }

  async verifyAccountUnderPartnerCode(
    hfmAccountNumber: string
  ): Promise<AccountVerificationResult> {
    // HFM does not offer a Partner API. Account verification is handled
    // via the manual reconciliation flow at /admin/hfm-sync (Prompt 12 v2).
    // This method exists in the interface for future-compatibility only.
    throw new Error(
      'HFM has no Partner API. Account verification happens via admin CSV ' +
      'reconciliation at /admin/hfm-sync. Do not call this method directly. ' +
      'If HFM ever offers an API, fill in this implementation.'
    )
  }

  async getMasterStrategyMetrics(): Promise<MasterStrategyMetrics> {
    // HFM does not offer a Partner API. Master strategy metrics
    // (specifically subscriber count) are updated manually via admin
    // dashboard at /admin/hfm-sync.
    throw new Error(
      'HFM has no Partner API. Master strategy metrics are managed via ' +
      'admin dashboard manual updates. Do not call this method directly.'
    )
  }

  async getActiveHfcopySubscribers(): Promise<string[]> {
    // HFM does not offer a Partner API. Active subscriber list is uploaded
    // by admin via CSV from HFM Partner Area dashboard.
    throw new Error(
      'HFM has no Partner API. Active subscribers are reconciled via ' +
      'admin CSV upload at /admin/hfm-sync. Do not call this method directly.'
    )
  }
}
```

## Update the provider factory

In `lib/brokers/index.ts`, update the switch statement:

```typescript
case 'hfm':
  const { HFMBrokerProvider } = await import('./hfm/provider')

  const config = {
    ibCode: process.env.HFM_IB_CODE!,
  }

  if (!config.ibCode) {
    throw new Error('Missing HFM_IB_CODE env var for HFMBrokerProvider')
  }

  cachedProvider = new HFMBrokerProvider(config)
  break
```

## README at `lib/brokers/hfm/README.md`

```markdown
# HFMBrokerProvider

This is the production broker implementation for HFM. As of v3.4, HFM does
not offer a public Partner API. The implementation is therefore minimal:

- `signupUrl()` — fully implemented (URL construction with IB referral code)
- All other methods throw "not yet implemented" errors

## Operational equivalents

The functions that would have been API calls in v3.3 are now manual processes:

| v3.3 API method | v3.4 manual equivalent |
|---|---|
| `verifyAccountUnderPartnerCode()` | Admin CSV reconciliation at `/admin/hfm-sync` |
| `getMasterStrategyMetrics()` | Admin manual subscriber count update at `/admin/hfm-sync` |
| `getActiveHfcopySubscribers()` | Same — admin reads from CSV upload |

## Future: if HFM offers a Partner API

If HFM ever announces a public Partner API:

1. Fill in the method implementations using HFM's documented endpoints
2. Add Finnhub or similar FX rate fetching if balance checks are reintroduced
3. Re-evaluate whether to bring back the v3.3 two-tier balance gate
4. Migrate users from manual reconciliation to automated sync

The interface preserves swap-readiness for this scenario.

## Configuration

Required env var: `HFM_IB_CODE` — your client's HFM IB referral code.

Set `BROKER_PROVIDER=hfm` to activate this provider in production.
```

## Tests

Add tests at `lib/brokers/hfm/provider.test.ts`:
- HFMBrokerProvider instantiates correctly with valid config
- `signupUrl` produces correct URL format with and without referral token
- All non-`signupUrl` methods throw with the documented "no Partner API" message
- Provider factory throws clear error if `BROKER_PROVIDER=hfm` but `HFM_IB_CODE` missing

## Verification before commit

1. `pnpm typecheck` clean
2. `pnpm test` — all tests pass including new HFM tests
3. `pnpm lint` clean
4. With `BROKER_PROVIDER=mock`, app continues to work normally
5. With `BROKER_PROVIDER=hfm` and missing env var, clear error message appears
6. `signupUrl` produces correct URL when called

## Suggested commit message

feat: Phase 3 Prompt 9 — HFMBrokerProvider skeleton

- HFMBrokerProvider implementing BrokerProvider interface
- signupUrl method fully implemented
- Other methods throw "no Partner API" errors with clear messaging
- README documents the v3.4 manual reconciliation pattern
- Provider factory updated to select HFM when BROKER_PROVIDER=hfm
- Test coverage verifies skeleton structural integrity
- v3.4: HFM has no public Partner API; methods preserved for future-compatibility
```

---

## Prompt 11 v2 — HFM account number recording

```
Build the HFM account number recording step at /subscribe.

This is the first authenticated step of the subscribe flow after disclosure signing. User records their HFM account number; reconciliation against our IB referral list happens via admin manual process (Prompt 12 v2).

In v3.4 there is no real-time API verification (HFM has no Partner API). The user is informed of a 24-48 hour reconciliation cycle.

## Visual reference

Match prototype p17 — subscribe flow page. The success message wording differs from prototype: there's no real-time verification, just acknowledgment of recording.

## Implementation requirements

### Route
- File: `app/(dashboard)/subscribe/page.tsx`
- Server Component for shell, Client Component for the form
- Auth + disclosure-signed middleware
- If user already has `hfm_account_number` recorded: skip to `/subscribe/info` (next page in flow that handles HFcopy handoff)

### Page structure

**Hero:**
- Step indicator: "Step 3 of 4"
- H1: "Connect your HFM account"
- Subhead: "Enter your HFM account number. We'll verify it's registered under our referral within 24-48 hours."

**Form:**
- Input: HFM account number (8-digit numeric, JetBrains Mono in input value)
- Server dropdown: HFM-Real / HFM-Real-Plus / HFM-Real-Pro (default: HFM-Real)
- Primary CTA: "Record account number"
- Below form, tertiary text: "We never ask for your trading password. Your credentials stay with HFM."
- Alternative path link: "Don't have an HFM account yet? Open one through our referral link →"

### Server Action

Create `app/(dashboard)/subscribe/actions.ts`:

```typescript
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

const RecordSchema = z.object({
  hfmAccountNumber: z.string().regex(/^\d{8}$/, 'Account number must be 8 digits'),
  server: z.enum(['HFM-Real', 'HFM-Real-Plus', 'HFM-Real-Pro']),
})

export async function recordHfmAccount(formData: FormData) {
  const supabase = createServerClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated', code: 'AUTH_REQUIRED' }
  }

  const parsed = RecordSchema.safeParse({
    hfmAccountNumber: formData.get('hfmAccountNumber'),
    server: formData.get('server'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, code: 'INVALID_INPUT' }
  }

  // Just record the claim — no real-time verification (HFM has no Partner API).
  // Verification happens via admin CSV reconciliation (Prompt 12 v2).
  const { error: updateError } = await supabase
    .from('signups')
    .update({
      hfm_account_number: parsed.data.hfmAccountNumber,
      hfm_account_verified_at: null,
      hfm_account_verified_under_our_code: false,
    })
    .eq('user_id', user.id)

  if (updateError) {
    return { error: 'Database update failed', code: 'DB_ERROR' }
  }

  revalidatePath('/subscribe')
  return { success: true }
}
```

### Client Component (the form)

`components/subscribe/account-recording-form.tsx`:
- Uses React Server Actions via `useFormState` hook
- Loading state during submission
- Conditional rendering based on result code
- After success: show success card, then `setTimeout(() => router.push('/subscribe/info'), 2500)`
- All visual styling matches the prototype

### Success state

After successful recording, show success card:
- Heading: "Account number recorded ✓"
- Body text: "We'll verify your account is under our referral within 24-48 hours via our daily reconciliation. You'll receive an email once confirmed, after which you can complete your HFcopy subscription on HFM's platform."
- Auto-redirect to /subscribe/info after 2.5 seconds

### /subscribe/info page (post-recording handoff)

Create `app/(dashboard)/subscribe/info/page.tsx`. This is the page users land on after recording their account number. Key contents:

- H1: "Your HFcopy subscription"
- Status card showing verification state ("Verification pending — typically 24-48 hours")
- Subscription summary card with strategy details, recommended minimum ($100 USD equivalent guidance only — no enforcement), pairs, sessions
- Primary CTA: "Open HFcopy subscription on HFM →" (deep link to HFM's HFcopy strategy URL)
- Body text: "You can complete your HFcopy subscription on HFM's platform now. Your dashboard here will reflect your subscription within 24-48 hours after our next reconciliation."
- Section explaining what happens next:
  - "1. We verify your HFM account is under our referral (24-48 hours)"
  - "2. We confirm via email"
  - "3. Your HayPlusbot dashboard updates to show your subscription status"
- Note: "If you're already subscribed on HFcopy, your trades start mirroring as soon as HFM activates the subscription on their side — that's separate from our verification timing."

### Tests

`app/(dashboard)/subscribe/actions.test.ts`:
- Schema validation rejects non-8-digit account numbers
- Schema validation rejects invalid servers
- Successfully recording updates the signups row with correct values (verified flags = false)
- Re-recording overwrites previous value (allowing user to correct mistakes)
- Unauthenticated user → AUTH_REQUIRED error

### Verification before commit

1. Visit /subscribe authenticated + disclosure-signed
2. Enter "10054472", server HFM-Real, submit → success card appears, then redirects to /subscribe/info
3. Refresh /subscribe — redirects to /subscribe/info (already recorded)
4. Test invalid format (less than 8 digits) — form validation catches
5. Test re-submission with different number — overwrites previous
6. /subscribe/info shows verification-pending state
7. `pnpm typecheck` and `pnpm test` clean

### Suggested commit message

feat: Phase 3 Prompt 11 v2 — HFM account number recording

- /subscribe records claimed HFM account number to signups
- No real-time API verification (HFM has no Partner API)
- /subscribe/info shows post-recording handoff with verification-pending state
- HFcopy subscription deep link for users to subscribe on HFM
- User informed of 24-48 hour reconciliation cycle
- Sets hfm_account_verified_under_our_code = false until admin reconciles
- Form validation, error handling, success state per prototype p17
- v3.4: replaces v3.3's real-time verification with manual reconciliation
```

---

## Prompt 12 v2 — Admin CSV reconciliation action

```
Build the admin CSV upload feature for reconciling HFM subscriber lists against HayPlusbot signups.

This replaces v3.3's automated daily Edge Function. Admin manually exports the referred-clients CSV from HFM Partner Area dashboard and uploads it here for reconciliation.

## Page

File: `app/(admin)/hfm-sync/page.tsx`
Auth: `requireAdmin()` middleware
Layout: matches admin dashboard pattern from prototype p16

## Add dependencies

`pnpm add papaparse @types/papaparse`

## UI sections

### Section A — Subscriber Reconciliation
- H2: "Subscriber Reconciliation"
- Body: "Upload the referred-clients CSV from HFM Partner Area to reconcile against HayPlusbot signups."
- Drag-and-drop upload zone (or file input fallback for keyboard accessibility)
- Help text: "Expected CSV columns: account_number, status, registration_date. Other columns ignored. File must be .csv, under 10MB."
- "Process upload" button (disabled until file uploaded)

### After processing — show summary card
- Total accounts in upload: N
- Active accounts (status = 'active'): M
- Newly verified (HayPlusbot user matched HFM list, was not yet verified): X
- Newly subscribed (matched + was not previously subscribed): Y
- Newly unsubscribed (was subscribed, no longer in HFM list): Z
- Already subscribed, still on list (unchanged): W
- Unmatched HayPlusbot users (claimed account not in upload): V with expandable list

### Section B — Manual unmatched user follow-up
For each unmatched HayPlusbot user:
- Email address (truncated for privacy: `j***@example.com`)
- Their claimed HFM account number
- "Send verification email" button (sends standardised email asking them to confirm account or reopen via referral)
- "Mark as ignored" option (admin discretion if user is known dropoff)

### Section C — Subscriber Count Update
- Current displayed count: shows `hfm_sync_state.subscribers_count`
- Input: new count (numeric, non-negative)
- Reason note (required for audit log): textarea, min 3 chars
- "Update count" button → writes to `hfm_sync_state` and `admin_action_log`

## Server Actions

Create `app/(admin)/hfm-sync/actions.ts`:

```typescript
'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit'
import { createServiceClient } from '@/lib/supabase/service'
import Papa from 'papaparse'

export async function reconcileHfcopySubscribers(formData: FormData) {
  const admin = await requireAdmin()
  const file = formData.get('csv') as File
  
  if (!file) return { error: 'No file uploaded' }
  if (file.size > 10 * 1024 * 1024) return { error: 'File too large (max 10MB)' }
  
  const text = await file.text()
  const parsed = Papa.parse<any>(text, { header: true, skipEmptyLines: true })
  
  if (parsed.errors.length > 0) {
    return { error: 'CSV parsing failed: ' + parsed.errors[0].message }
  }
  
  // Validate required column
  const firstRow = parsed.data[0]
  if (!firstRow || !('account_number' in firstRow)) {
    return { error: 'CSV missing required column: account_number' }
  }
  
  // Extract active account numbers
  const accountNumbers = new Set<string>(
    parsed.data
      .filter(row => !row.status || row.status?.toLowerCase() === 'active')
      .map(row => row.account_number?.toString().trim())
      .filter(Boolean)
  )
  
  const supabase = createServiceClient()
  
  // Fetch all HayPlusbot signups with HFM account numbers
  const { data: signups, error: fetchError } = await supabase
    .from('signups')
    .select('id, user_id, email, hfm_account_number, hfcopy_subscribed, hfm_account_verified_under_our_code')
    .not('hfm_account_number', 'is', null)
  
  if (fetchError) return { error: 'Database fetch failed: ' + fetchError.message }
  
  let newlyVerified = 0
  let newlySubscribed = 0
  let newlyUnsubscribed = 0
  let alreadySubscribed = 0
  const unmatchedUsers: { id: string; email: string; account: string }[] = []
  
  for (const signup of signups || []) {
    const onHfmList = accountNumbers.has(signup.hfm_account_number!)
    
    if (onHfmList) {
      const updates: Record<string, any> = {}
      
      if (!signup.hfm_account_verified_under_our_code) {
        updates.hfm_account_verified_at = new Date().toISOString()
        updates.hfm_account_verified_under_our_code = true
        newlyVerified++
      }
      
      if (!signup.hfcopy_subscribed) {
        updates.hfcopy_subscribed = true
        updates.hfcopy_subscribed_at = new Date().toISOString()
        updates.hfcopy_unsubscribed_at = null
        newlySubscribed++
        // TODO Phase 7: trigger welcome email via Resend
      } else {
        alreadySubscribed++
      }
      
      if (Object.keys(updates).length > 0) {
        await supabase
          .from('signups')
          .update(updates)
          .eq('id', signup.id)
      }
    } else {
      // Not on HFM list
      if (signup.hfcopy_subscribed) {
        await supabase
          .from('signups')
          .update({
            hfcopy_subscribed: false,
            hfcopy_unsubscribed_at: new Date().toISOString(),
          })
          .eq('id', signup.id)
        newlyUnsubscribed++
      }
      
      if (!signup.hfm_account_verified_under_our_code) {
        unmatchedUsers.push({
          id: signup.id,
          email: signup.email,
          account: signup.hfm_account_number!,
        })
      }
    }
  }
  
  await logAdminAction(admin.id, 'reconcile_hfcopy_subscribers', {
    file_name: file.name,
    file_size: file.size,
    total_in_upload: parsed.data.length,
    active_accounts: accountNumbers.size,
    newly_verified: newlyVerified,
    newly_subscribed: newlySubscribed,
    newly_unsubscribed: newlyUnsubscribed,
    already_subscribed: alreadySubscribed,
    unmatched_count: unmatchedUsers.length,
  })
  
  return {
    success: true,
    summary: {
      totalInUpload: parsed.data.length,
      activeInUpload: accountNumbers.size,
      newlyVerified,
      newlySubscribed,
      newlyUnsubscribed,
      alreadySubscribed,
      unmatchedCount: unmatchedUsers.length,
      unmatchedUsers: unmatchedUsers.map(u => ({
        id: u.id,
        emailMasked: maskEmail(u.email),
        account: u.account,
      })),
    },
  }
}

export async function updateSubscriberCount(formData: FormData) {
  const admin = await requireAdmin()
  
  const newCount = parseInt(formData.get('count') as string, 10)
  const reason = (formData.get('reason') as string)?.trim()
  
  if (isNaN(newCount) || newCount < 0) {
    return { error: 'Invalid count value' }
  }
  
  if (!reason || reason.length < 3) {
    return { error: 'Reason note required (minimum 3 characters)' }
  }
  
  const supabase = createServiceClient()
  
  const { data: current } = await supabase
    .from('hfm_sync_state')
    .select('subscribers_count')
    .eq('id', true)
    .single()
  
  await supabase
    .from('hfm_sync_state')
    .upsert({
      id: true,
      subscribers_count: newCount,
      subscribers_synced_at: new Date().toISOString(),
    })
  
  await logAdminAction(admin.id, 'update_subscriber_count', {
    previous_count: current?.subscribers_count ?? null,
    new_count: newCount,
    reason,
  })
  
  return { success: true, newCount }
}

export async function sendVerificationEmailToUnmatched(userId: string) {
  const admin = await requireAdmin()
  
  // TODO Phase 7: actually send via Resend
  // For now, log the intent
  
  await logAdminAction(admin.id, 'send_verification_followup_email', {
    target_user_id: userId,
  })
  
  return { success: true }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const maskedLocal = local[0] + '***'
  return `${maskedLocal}@${domain}`
}
```

## Tests

Create `app/(admin)/hfm-sync/actions.test.ts`:

- Upload sample CSV with 5 accounts (3 active, 2 inactive)
- Verify only active accounts are processed
- Verify newly_subscribed count is correct when previously unsubscribed user matches
- Verify newly_verified count is correct
- Verify newly_unsubscribed when previously subscribed user removed from list
- Verify unmatched users are listed correctly with masked emails
- Verify admin_action_log row created with correct metadata
- Test malformed CSV produces clear error
- Test missing required column (account_number) produces clear error
- Test file size validation (>10MB rejected)
- updateSubscriberCount validates inputs and creates audit log
- updateSubscriberCount rejects negative counts and short reason notes

## Verification before commit

1. Create a sample CSV with mixed account states (3 matching HayPlusbot users, 2 not, 1 inactive)
2. Upload via admin dashboard at /admin/hfm-sync
3. Verify summary numbers are correct
4. Verify signups rows updated correctly in DB
5. Check admin_action_log captures the reconciliation action with all metadata
6. Test subscriber count update with valid and invalid inputs
7. Test malformed CSV produces sensible error message
8. Test the unmatched-user follow-up flow (clicking "Send verification email" logs the action)
9. `pnpm typecheck` and `pnpm test` clean

## Suggested commit message

feat: Phase 3 Prompt 12 v2 — admin CSV subscriber reconciliation

- /admin/hfm-sync page with CSV upload and reconciliation
- Replaces v3.3's automated daily Edge Function (HFM has no Partner API)
- CSV parsing via papaparse with size and column validation
- Reconciles signups.hfcopy_subscribed against HFM's exported list
- Identifies newly-verified, newly-subscribed, newly-unsubscribed, unmatched
- Email masking for privacy in unmatched users list
- Manual subscriber count update with audit logging
- Welcome email and unmatched-user follow-up TODO for Phase 7 Resend
- Per audit pattern: every action logs to admin_action_log with full metadata
- File size limit 10MB; CSV only; service-role-only access
```

---

## After Phase 3 v2 is complete

Once all four prompts are committed and pushed, you'll have:

- A working broker abstraction with mock and HFM-skeleton implementations
- The full subscribe flow including account number recording (no balance gate)
- Admin CSV reconciliation infrastructure for v3.4's manual verification model
- Audit trail for every reconciliation action

**What's still pending external dependencies:**

1. HFM strategy provider authorisation completion → required to actually launch the master strategy on HFcopy
2. MetaAPI.cloud subscription → needed for Phase 4 (signal engine connecting to master account)
3. Trading Economics API account → needed for Phase 4 (economic calendar filter)
4. Finnhub free API key → needed for Phase 4 (DXY filter, news)
5. Nigerian solicitor review → recommended before launch

**Next: Phase 4 (signal engine and bot worker).**

When you're through Phase 3 v2, message me. We'll plan Phase 4 properly. Phase 4 is where the SMC/ICT methodology becomes TypeScript code that runs against live market data and executes trades on the master account via MetaAPI.

## What if Claude Code asks clarifying questions

Some Phase 3 prompts produce questions because the prompt makes assumptions about your auth structure or Supabase service client setup. If asked, the answers are usually:

- "Service client" → `createServiceClient()` from `lib/supabase/service.ts` using `SUPABASE_SERVICE_ROLE_KEY`
- "Server client" → `createServerClient()` from `lib/supabase/server.ts` for user-context queries
- "Admin auth helper" → `requireAdmin()` from `lib/auth/require-admin.ts` (built in Phase 1 / Prompt 25 if not yet)

If your Phase 1 didn't create `requireAdmin()` yet (it's planned for Phase 6 Prompt 25), you can either:
- Add a temporary local helper in the actions file for now
- Defer the admin reconciliation page until Phase 6 is built and come back to it

The cleanest approach is the second — Phase 3 builds the broker abstraction and account recording (which don't need admin), then Phase 6 adds the admin layer including the reconciliation UI built against the same actions.

If that's preferred, treat Prompt 12 v2 above as "build the actions and tests now in `lib/admin/reconciliation.ts`; the UI page comes later in Phase 6."
