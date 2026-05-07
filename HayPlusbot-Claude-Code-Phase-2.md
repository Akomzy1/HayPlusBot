# HayPlusbot — Claude Code Phase 2 Build Prompts

**Phase 2: Marketing site (public, unauthenticated pages)**

This document contains four ready-to-paste Claude Code prompts. Each builds one public marketing page, referencing the corresponding prototype HTML file as the visual source of truth.

## How to use this document

**Run prompts one at a time.** Don't paste all four into Claude Code in one session. Each page has its own visual style decisions, content nuances, and SEO requirements. Doing them sequentially with a git commit between each gives you:

- Cleaner git history (one commit per page, easy to review and roll back)
- Better Claude Code performance (each prompt has full context attention)
- Easier debugging if something goes wrong (you know which page introduced an issue)

**Recommended order:**
1. Prompt 4 — Landing page (highest visibility, most content, get it right first)
2. Prompt 5 — How-it-works (educational deep-dive, builds on landing's tone)
3. Prompt 6 — FAQ (content-heavy but visually simpler)
4. Prompt 7 — Risk disclosure read-only view (smallest scope)

**Per-prompt workflow:**
1. Open Claude Code in your project root
2. Paste the prompt
3. Let it run — typically 8-15 minutes per page including verification
4. Review locally: `pnpm dev`, visit the page, check responsiveness on mobile width
5. Run `pnpm typecheck` and verify clean
6. Commit with the suggested message
7. Push to GitHub
8. Move to next prompt

**Estimated total time for Phase 2:** 6-10 hours of focused work across the four pages. Realistic to space across 2-4 sessions over a week.

---

## Prompt 4 — Landing page

```
Build the HayPlusbot landing page at the route `/` (the homepage).

## Visual reference

The complete visual design lives in `prototypes/p1-landing.html`. Match it precisely:

- Layout sections, ordering, and proportions
- Typography (Outfit for UI, JetBrains Mono for numbers, exact size scale)
- Colour palette (background #0A0B0F, surface #12141B, surface elevated #1A1D26, teal #1D9E75, coral #D85A30, amber #BA7517)
- Spacing scale (4, 8, 12, 16, 20, 24, 32, 48, 64, 96px)
- Border radii (6px buttons, 8px inputs/small cards, 12px medium cards, 16px large panels)
- Motion (200ms ease-out hover, 300ms ease-in-out layout shifts)
- All visual details — the prototype is authoritative

If anything in the prototype seems unclear, prefer the prototype's interpretation over your own.

## Implementation requirements

### Structure

- File: `app/(marketing)/page.tsx` (per the directory structure in CLAUDE.md)
- Server Component by default
- All visuals from CSS, SVG, or inline illustration — no external images
- Components extracted into `components/marketing/` where they're substantial:
  - `components/marketing/hero.tsx`
  - `components/marketing/subscriber-count.tsx`
  - `components/marketing/performance-teaser.tsx`
  - `components/marketing/how-it-works.tsx`
  - `components/marketing/strategy-features.tsx`
  - `components/marketing/simplicity-cards.tsx`
  - `components/marketing/recent-signals.tsx`
  - `components/marketing/landing-faq.tsx`
  - `components/marketing/risk-callout.tsx`
- Smaller atoms (icon wrappers, button variants) in `components/ui/` if they're reusable

### Telegram floating button

Build the floating Telegram button as `components/marketing/telegram-button.tsx`:
- Fixed bottom-right, 24px from edges (16px on screens below 480px)
- 56px circular teal button (48px on small screens)
- lucide-react `Send` icon centred
- Drop shadow: 0 4px 12px rgba(29, 158, 117, 0.3); intensifies subtly on hover
- Hover: scale 1.05, ease-out 200ms
- On click: opens `process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` in new tab
- Tooltip on hover: "Join our Telegram channel" appearing left of the button
- aria-label: "Open HayPlusbot Telegram channel in new tab"
- z-index: 50
- Initial entrance: 2-second delay after page load, then scale-up animation 300ms ease-out
- Read URL via `process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` — for development, this can fall back to a placeholder if not set
- Should appear on the landing page and other public marketing pages, NOT on authenticated pages or onboarding flows
- Implementation note: this needs to be a Client Component (uses useEffect for the entrance animation)

### Subscriber count widget

Build as `components/marketing/subscriber-count.tsx`:
- Reads count from `hfm_sync_state.subscribers_count` via Supabase server-side query
- If count < 50: do NOT render the component (returns null)
- If count >= 50: renders "{count} traders copying HayPlusbot" with small teal pulsing dot
- Cached at the request level (Next.js fetch with revalidate: 300 = 5 min)
- For Phase 2, since hfm_sync_state will likely have count = 0 in development, the component renders nothing during dev — that's correct behaviour

### Performance teaser

Build as `components/marketing/performance-teaser.tsx`:
- Compact 90-day equity curve using recharts (LineChart with Area fill)
- Reads from `master_account_metrics` table (will be empty in development)
- If table is empty: display "Performance data will appear once the master account begins trading" placeholder card
- If data exists: render the curve plus three stats below (Total pips, Win rate, Active subscribers — all in JetBrains Mono)
- "View full performance →" link goes to `/dashboard` (authenticated route, will redirect to login if user not signed in)

### Recent signals

Build as `components/marketing/recent-signals.tsx`:
- Server-side query for the 3 most recent signals from `signals` table where `classification = 'a_plus'`
- For each: render a simplified version of the signal card pattern (timestamp mono, pair + direction, confluence pill, narrative, outcome badge)
- If table is empty (development state): display 3 placeholder cards with text "Live signals will appear here once the master account fires its first A+ setup"
- Uses Supabase Server Client per the auth pattern from Phase 1

### Landing FAQ accordion

Build as `components/marketing/landing-faq.tsx`:
- Client Component (needs interactivity)
- 4 questions matching the prototype:
  1. Can I lose money?
  2. Do I need to know about forex?
  3. Which brokers do you work with?
  4. How do I subscribe?
- Accordion behaviour: clicking a question expands its answer; multiple can be open
- Smooth height transition (200ms ease-out)
- Below the four: "See all FAQs →" link to `/faq`

### Risk callout

Build as `components/marketing/risk-callout.tsx`:
- Amber-soft background card (rgba(186, 117, 23, 0.12))
- 1px amber border
- Body text: "Subscribing to copy-trading strategies involves real capital at real risk. Past performance does not guarantee future results."
- Link: "Read our risk disclosure →" navigating to `/risk-disclosure`

### Footer

Build as `components/marketing/footer.tsx` (reusable across all marketing pages):
- HayPlusbot logo on the left
- Links: How it works · FAQ · Risk disclosure · Terms · Privacy
- Small text: "HayPlusbot is an authorised strategy provider on HFM's HFcopy platform. HayPlusbot Nigeria, Lagos."
- Telegram link icon (only social link)

### SEO and metadata

Implement `generateMetadata` for the landing page:
- title: "HayPlusbot — AI Forex Copy-Trading Strategy on HFM's HFcopy"
- description (155 chars): "Subscribe to an authorised HFM copy-trading strategy. SMC/ICT A+ setups across 9 pairs. Free signup. Transparent performance. Trade only what qualifies."
- Open Graph tags
- Twitter Card tags
- Canonical URL pointing to the production hayplusbot.com domain
- JSON-LD Service schema (not Product — we're not selling a product, we're operating a service):
  - @type: Service
  - name: HayPlusbot Copy-Trading Strategy
  - provider: { @type: Organization, name: HayPlusbot, url: https://hayplusbot.com }
  - serviceType: "Copy trading"
  - areaServed: { @type: Country, name: "Worldwide" }

Use Next.js Vercel OG for dynamic OG image generation:
- Route: `app/api/og/route.tsx`
- Generates a branded OG image with HayPlusbot logo, dark background, and the page-specific tagline
- 1200x630px standard OG dimensions

### Top navigation

Build as `components/marketing/top-nav.tsx` (reusable across all marketing pages):
- Logo on the left
- Links: How it works · FAQ · Sign in
- Primary CTA: "Get started" (teal button)
- Fixed position with subtle background appearance on scroll (use intersection observer or scroll listener)
- Mobile: collapses to hamburger below 768px

### Commercial silence policy

Per v3.2 commercial-silence policy:
- NO mention of "40%", "60%", "40/60 split", "performance fee percentage" anywhere on this page
- The "What makes this simple" section's three cards reference fee characteristics ("No charge on losses", "No monthly subscription", "Administered by HFM") without specifying percentages — these wordings come directly from the prototype, follow them precisely
- Trust strip near hero focuses on "HFM-authorised strategy provider · Regulated broker partner · Master account runs 24/5" — no commercial mechanics

### Accessibility

- Semantic HTML throughout: header, nav, main, section, article, footer
- Heading hierarchy: one h1 (the hero title), then h2 for major sections, h3 for sub-sections
- All interactive elements keyboard navigable
- Focus states visible (2px teal outline)
- aria-labels on icon-only buttons
- Colour contrast WCAG AA minimum
- Skip-to-content link for screen readers (visible on focus)
- Animations respect prefers-reduced-motion

### Mobile responsiveness

- Minimum supported width: 360px
- Test at: 360px, 768px, 1024px, 1440px
- Hero stacks vertically on mobile
- 3-column grids collapse to single column below 768px
- Top nav collapses to hamburger below 768px
- Telegram button shrinks to 48px below 480px

## Verification before commit

Before declaring done:
1. `pnpm dev` and visit http://localhost:3000
2. Verify visual match to prototype on:
   - Desktop (1440px)
   - Tablet (768px)
   - Mobile (360px)
3. Telegram button appears bottom-right and opens correctly
4. All "← View FAQ" / "Read disclosure" links work (they'll go to placeholder pages until those are built)
5. `pnpm typecheck` clean
6. `pnpm lint` clean
7. Lighthouse audit: Accessibility ≥ 95, SEO ≥ 95
8. View page source: confirm meta tags, Open Graph tags, JSON-LD all present
9. Test with prefers-reduced-motion: animations disabled

## Suggested commit message

feat: Phase 2 Prompt 4 — landing page

- Hero, subscriber count widget (50+ threshold), performance teaser
- "What makes this simple" section (commercial-silence compliant)
- Recent signals section with empty-state for development
- Floating Telegram button on public pages
- Landing FAQ accordion (4 questions)
- Risk callout linking to /risk-disclosure
- SEO metadata, Open Graph, JSON-LD Service schema
- Components extracted to components/marketing/
- Mobile responsive 360px+, WCAG AA
```

---

## Prompt 5 — How it works page

```
Build the HayPlusbot "How it works" page at the route `/how-it-works`.

## Visual reference

The complete visual design lives in `prototypes/p4-how-it-works.html`. Match it precisely. Reuse the design system patterns established in Prompt 4 (landing page) for consistency.

## Implementation requirements

### Structure

- File: `app/(marketing)/how-it-works/page.tsx`
- Server Component (no client interactivity needed)
- Reuse the top navigation and footer from Prompt 4 (`components/marketing/top-nav.tsx` and `components/marketing/footer.tsx`)
- Telegram floating button included (it's on all public marketing pages)
- Page-specific components in `components/marketing/how-it-works/`:
  - `hero.tsx`
  - `smc-explanation.tsx` (Section 1)
  - `confluence-factors.tsx` (Section 2 — the 7 factors as small cards)
  - `fundamental-filters.tsx` (Section 3 — 3 feature cards)
  - `pairs-and-sessions.tsx` (Section 4 — pair grid + session cards)
  - `participation-steps.tsx` (Section 5 — 4 numbered steps)
  - `differentiators.tsx` (Section 6 — 2x2 grid)

### Section 5 — How you participate

Critical: this section has 4 steps in v3.3, NOT 5. The previous v3 versions had a 5th step about fee mechanics; that's removed per the v3.2 commercial-silence policy. The four steps are:

1. "Sign up on HayPlusbot" — Email verification only. Takes 2 minutes.
2. "Sign the risk disclosure" — Quick acknowledgment of what copy trading involves. Required before accessing performance data or subscribing.
3. "Open an HFM account via our referral link" — If you don't have one under our IB code already. HFM handles KYC; budget 15-60 minutes depending on their queue.
4. "Subscribe on HFcopy" — Complete your subscription on HFM's HFcopy platform. From this point, our master account's trades mirror into yours automatically.

Below the four steps, callout text: "We don't manage your money. HFM does. Every trade, fee, and copy mechanic happens inside their platform."

### SMC explanation (Section 1)

The illustrative chart is an inline SVG with annotations. Don't try to use a real chart library here — it's a static diagram. The SVG should show:
- A simplified candlestick price chart (8-12 candles)
- Order block annotations as teal rectangles
- Fair value gap annotations as teal-soft rectangles
- Liquidity sweep arrows in coral
- Break of structure label markers

This is illustrative, not data-driven. Build it as a hand-crafted SVG component that captures the methodology visually.

### Confluence factors (Section 2)

Render the 7 factors as a 7-card grid (responsive: 4 cols on desktop, 2 on tablet, 1 on mobile). Each card:
- Small lucide-react icon at top
- Factor number (e.g., "F1") in tertiary mono
- Factor name (e.g., "HTF bias alignment")
- One-sentence description

The 7 factors:
1. HTF bias alignment
2. Liquidity sweep present
3. Fair value gap identified
4. Order block retest
5. Session alignment
6. Previous day's high/low swept
7. Structural break confirmation

Below the grid, body text: "An A+ setup requires at least 6 of 7 confluence factors to pass. This deliberately limits trades to the highest-conviction opportunities. Beyond these structural factors, three fundamental filters must also pass."

### Fundamental filters (Section 3)

Three feature cards in a row:
1. "Interest rate differentials" — body about monetary policy alignment
2. "Economic calendar" — body about no-trade-around-news
3. "DXY correlation" — body explaining USD pair filter, with "(JPY crosses skip this filter since they don't contain USD.)" parenthetical

### Pairs grid (Section 4)

9-pair grid showing each pair with country flag SVGs and the pair code in JetBrains Mono. Use inline SVG flags — don't fetch external flag images.

The 9 pairs:
- Six majors: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF
- Three JPY crosses: GBP/JPY, EUR/JPY, AUD/JPY

Below the grid, two session cards:
1. London session — 07:00-10:00 GMT
2. NY AM session — 12:30-15:30 GMT

Below the session cards: "We don't trade the Asian session — price action there tends to be range-bound, and SMC setups perform differently. The discipline of trading only London and NY AM is deliberate."

### Differentiators (Section 6)

2x2 grid:
1. Discipline — "3-7 A+ trades per week, not 20. Quality over volume."
2. Transparency — "Full public performance history — no cherry-picking, no hidden drawdowns."
3. Simplicity — "No bot to configure. No MT5 credentials to manage. No settings to maintain."
4. Authority — "Authorised strategy provider on HFM's HFcopy platform."

### CTA block

H2: "Ready to subscribe?"
Two buttons: "Sign up →" (primary teal, links to /signup) and "Read the FAQ first" (ghost secondary, links to /faq).

### Commercial silence policy

NO fee percentages anywhere. Section 5's 4-step participation flow ends at Step 4 (subscribe on HFcopy) — does not have a 5th step about fee mechanics. The differentiators reference "Authority" via HFM partnership without commercial specifics.

### SEO and metadata

- title: "How HayPlusbot Works — SMC/ICT Strategy Methodology"
- description: "Smart Money Concepts methodology applied across 9 forex pairs. London and NY AM sessions only. 7 confluence factors plus fundamental filters. Disciplined, rule-based execution."
- Open Graph and Twitter Card tags
- Canonical URL: https://hayplusbot.com/how-it-works
- Schema.org Article schema (since this is educational content)
- Use the dynamic OG image route from Prompt 4 with this page's tagline

### Accessibility and responsiveness

Same standards as Prompt 4: semantic HTML, heading hierarchy, mobile responsive 360px+, WCAG AA contrast, prefers-reduced-motion support.

## Verification before commit

1. Visit http://localhost:3000/how-it-works
2. Verify visual match to prototype across desktop, tablet, mobile
3. All section anchors work if implemented
4. Top nav and footer consistent with landing page
5. Telegram floating button appears
6. CTA buttons navigate correctly
7. `pnpm typecheck` and `pnpm lint` clean
8. Lighthouse: Accessibility ≥ 95, SEO ≥ 95
9. View page source: meta tags, OG, JSON-LD Article schema present

## Suggested commit message

feat: Phase 2 Prompt 5 — how-it-works page

- 6 sections: SMC overview, 7 confluence factors, fundamental filters,
  pairs and sessions, 4-step participation, differentiators
- Inline SVG illustrative chart for SMC explanation
- 9-pair grid with inline SVG flags
- Reuses top nav and footer from landing
- Section 5 has 4 steps (commercial-silence compliant — no fee step)
- SEO metadata with Article schema
```

---

## Prompt 6 — FAQ page

```
Build the HayPlusbot FAQ page at the route `/faq`.

## Visual reference

The complete visual design lives in `prototypes/p3-faq.html`. Match it precisely. Reuse the top navigation, footer, and Telegram button from earlier Phase 2 prompts.

## Implementation requirements

### Structure

- File: `app/(marketing)/faq/page.tsx`
- Server Component for the page shell
- The accordion itself needs to be a Client Component (`components/marketing/faq/faq-accordion.tsx`) for interactivity
- Other components:
  - `components/marketing/faq/category-tabs.tsx`
  - `components/marketing/faq/faq-search.tsx` (client component for filtering)

### Categories and questions

5 categories with 24 total questions:

**The Basics (5 questions)**
1. What exactly is HayPlusbot?
2. Is this a bot I run on my computer?
3. What's HFcopy?
4. Do I need MT5 experience?
5. What does a typical trading week look like?

**Subscribing (6 questions)**
6. Do I have to use your referral link?
7. What if I already have an HFM account?
8. What's the minimum deposit?
9. How long does setup take?
10. Can I use a different broker?
11. How do I unsubscribe?

**Performance & Risk (5 questions)**
12. How can I see live performance?
13. Can I lose money?
14. What's your historical win rate?
15. How is the strategy tested?
16. What happens during volatile markets?

**Subscription & Fees (4 questions)**
17. How does HayPlusbot make money?
18. When does the fee apply?
19. What if the strategy has a losing week or month?
20. Can I pause my subscription?

**Technical (4 questions)**
21. Which pairs do you trade?
22. What times do you trade?
23. What if HFM has an outage?
24. Is there a mobile app?

For the exact answer text for each question, refer to `prototypes/p3-faq.html`. Use those answers verbatim — they've been refined through several rounds and align with v3.3 commercial-silence policy.

Critical answers that have specific v3.3 wording:

**Q17 "How does HayPlusbot make money?"**
"HayPlusbot operates as an authorised strategy provider on HFM's HFcopy platform. Fee structure and commercial arrangements are administered by HFM through their subscription interface. When you subscribe, HFM's platform shows you exactly what you'll be charged and when. HayPlusbot does not charge you directly."

**Q18 "When does the fee apply?"**
"Fees are calculated and collected by HFM on trades that close in profit. See your subscription details on HFM's HFcopy platform for the exact timing and mechanics."

**Q8 "What's the minimum deposit?"**
"HFM sets its own minimum deposit requirements for HFcopy subscriptions. Their platform will show you the exact minimum during the subscription process. HayPlusbot doesn't enforce a separate minimum — if HFM's threshold is met, you can subscribe."

(The internal $90 hard gate from v3.3 is NOT mentioned here — it's enforced server-side at the subscribe page, not exposed in FAQ.)

NO question or answer mentions specific fee percentages ("40%", "60%", "40/60 split").

### Accordion behaviour

- Clicking a question expands its answer
- Multiple questions can be open simultaneously
- Smooth height transition (200ms ease-out)
- Click again to collapse
- Each question has a unique URL hash (`/faq#question-1`) so direct links work
- Keyboard accessible: Tab to focus, Enter or Space to expand, arrow keys to navigate between questions

### Search functionality

Client-side search input at the top of the page:
- Placeholder: "Search questions..."
- As user types, filter visible questions to those containing the search text in question or answer
- Highlight matched text within questions
- Show "No results found" state if no matches
- Clear button (×) inside input
- Debounce input by 150ms
- Keyboard accessible

### Category tabs

Horizontal tab bar above the FAQ content:
- 5 tabs: The Basics · Subscribing · Performance & Risk · Subscription & Fees · Technical
- Plus an "All" tab as the default
- Clicking a tab filters to questions in that category
- Active tab has teal underline (3px)
- Hover state on inactive tabs
- Mobile: tabs scroll horizontally if they don't fit

### "Still have questions?" callout

At the bottom of the page:
- Card with subtle border
- Body: "Can't find your answer? Email us at hello@hayplusbot.com. We respond within 72 hours."
- Mailto link wrapped around the email address

### SEO and metadata

- title: "HayPlusbot FAQ — Common Questions About HFcopy Strategy"
- description: "Everything you need to know about subscribing to HayPlusbot's HFM HFcopy strategy. Onboarding, performance, risk, technical details."
- Open Graph and Twitter Card tags
- Canonical URL: https://hayplusbot.com/faq

**JSON-LD FAQPage schema:** This is critical for SEO. Generate a complete FAQPage schema with all 24 Q&A pairs:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What exactly is HayPlusbot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HayPlusbot is an authorised strategy provider on HFM's HFcopy platform..."
      }
    },
    ... // all 24 Q&A pairs
  ]
}
```

The schema must include the full text of each answer. This is what makes the FAQ findable in Google's "People also ask" results and AI-powered search overviews.

### Accessibility

- Each question is a button element with proper aria-expanded state
- Each answer panel has aria-labelledby pointing to its question
- Search input has proper label and aria-describedby for the live results count
- Category tabs use proper tab/tabpanel ARIA pattern
- Keyboard navigation: Tab through questions, Enter to expand, arrow keys between categories

### Mobile responsiveness

- Category tabs scroll horizontally on narrow screens
- Search input remains usable
- Accordion items stack naturally
- Top nav and Telegram button consistent with other marketing pages

## Verification before commit

1. All 24 questions present with correct answers from prototype
2. No fee percentages anywhere in question or answer text
3. Accordion expand/collapse works smoothly
4. Search filters correctly with debouncing
5. Category tabs filter correctly
6. Direct hash links work (test `/faq#question-1`)
7. View page source: complete FAQPage JSON-LD with all 24 pairs
8. Keyboard navigation: full Tab + arrow key support
9. `pnpm typecheck` and `pnpm lint` clean
10. Lighthouse: Accessibility ≥ 95, SEO ≥ 95
11. Mobile responsive across breakpoints

## Suggested commit message

feat: Phase 2 Prompt 6 — FAQ page

- 24 questions across 5 categories
- Accordion with multi-open support, hash routing, keyboard nav
- Client-side search with debouncing and result highlighting
- Category tabs with horizontal scroll on mobile
- JSON-LD FAQPage schema with all Q&A pairs (SEO critical)
- v3.3 commercial-silence compliant — no fee percentages
- Reuses top nav, footer, Telegram button from earlier prompts
```

---

## Prompt 7 — Risk disclosure read-only public view

```
Build the public read-only view of the risk disclosure at the route `/risk-disclosure`.

This is the publicly viewable version. The signing flow (where users actually acknowledge and sign) is at `/onboarding/disclosure` — that's a separate, authenticated, multi-step interactive page (the corresponding prototype is p13). For now, you're building the read-only public view that the landing page's risk callout links to.

## Visual reference

The disclosure content is in `HayPlusbot-Risk-Disclosure.md` at the project root. The visual design pattern (typography, layout, sticky table of contents) follows the same approach as `prototypes/p13-risk-disclosure.html` but without the interactive scroll-gating, checkboxes, or sticky progress bar — those are signing-flow features.

## Implementation requirements

### Structure

- File: `app/(public)/risk-disclosure/page.tsx`
- Server Component
- Reuses top navigation, footer, Telegram button from earlier Phase 2 prompts
- Page-specific components in `components/public/risk-disclosure/`:
  - `disclosure-content.tsx` (the long-form content)
  - `disclosure-toc.tsx` (table of contents)

### Loading the content

The disclosure has 9 parts. Read the content from `HayPlusbot-Risk-Disclosure.md` at build time (this is a Server Component, so file reads are fine):

```typescript
import fs from 'fs/promises'
import path from 'path'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

async function getDisclosureContent() {
  const filePath = path.join(process.cwd(), 'HayPlusbot-Risk-Disclosure.md')
  const fileContent = await fs.readFile(filePath, 'utf-8')
  // Parse markdown to HTML using remark
  const processed = await remark().use(remarkHtml).process(fileContent)
  return processed.toString()
}
```

Add `remark` and `remark-html` to dependencies (`pnpm add remark remark-html`).

### Layout

```
┌─────────────────────────────────────────────────────┐
│                  Top navigation                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────────────────┬──────────────────┐    │
│   │                         │                  │    │
│   │   Main content (800px)  │   TOC sidebar    │    │
│   │                         │   (sticky)       │    │
│   │   - Hero header         │   - Part 1       │    │
│   │   - Part 1              │   - Part 2       │    │
│   │   - Part 2              │   - ...          │    │
│   │   - ...                 │   - Part 9       │    │
│   │   - Part 9              │                  │    │
│   │                         │                  │    │
│   └─────────────────────────┴──────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      Footer                         │
└─────────────────────────────────────────────────────┘
```

### Hero header

- H1: "Risk Disclosure"
- Subhead: "Read this before subscribing to HayPlusbot's strategy."
- Below: small note in tertiary text — "Version 3.3 · Last updated [date from frontmatter or hardcoded]"
- Below the note: amber-soft callout linking to the signing flow:
  - "Ready to subscribe? You'll need to acknowledge this disclosure as part of signup."
  - Button: "Sign up to acknowledge →" (links to `/signup`)

### Main content

The 9 parts of the disclosure rendered with proper typography:
- H2 for each Part heading
- H3 for sub-sections
- Body text in 16px Outfit, comfortable line-height (1.6)
- Max line length ~680px for readability
- Generous spacing between Parts (64px top padding, subtle 1px border-top separator)
- Bold emphasis preserved
- Bulleted lists rendered with proper indentation
- The Part 3 responsibility split should render as a structured layout (two side-by-side cards on desktop, stacked on mobile) with:
  - Teal-soft "What HayPlusbot is responsible for" card on left
  - Amber-soft "What you are responsible for" card on right
  - Full-width "What neither of us controls" card below
- The Part 5 acknowledgment boxes render as visual cards (with the quoted commitment text) but WITHOUT functional checkboxes — this is the read-only view, not the signing flow

### Table of contents (sidebar)

- Sticky positioned on the right, scrolls with the page
- Lists 9 parts with click-to-anchor scrolling
- Active section highlighted (use IntersectionObserver for scroll-spy behaviour — this requires a Client Component)
- Smooth scroll behaviour
- Hidden on mobile (replaced by a "Jump to section" dropdown at the top of content)

### "Sign up to acknowledge" CTA

At the bottom of the disclosure (after Part 9):
- Larger callout card
- H2: "Ready to subscribe?"
- Body: "If you've read the above and want to proceed, sign up to formally acknowledge this disclosure and continue to subscription."
- Primary CTA: "Sign up →" (links to /signup)
- Small note: "Acknowledgment is mandatory before accessing performance data, signal archive, or subscribing on HFcopy."

### Document version footer

At the very bottom of the content:
- Version: 3.3
- Last updated: [date]
- Document hash: small mono text "Hash will be generated at signing"
- Contact: "Questions? Email hello@hayplusbot.com"

### SEO and metadata

- title: "Risk Disclosure — HayPlusbot Copy Trading"
- description: "Risk disclosure for HayPlusbot's HFM HFcopy strategy. Trading risk, responsibility split, commercial arrangement, jurisdiction. Read before subscribing."
- noindex: false (this should be indexed — search engines should be able to find the disclosure)
- Schema.org Article schema with date metadata
- Canonical URL: https://hayplusbot.com/risk-disclosure

### Accessibility

- Proper heading hierarchy (h1 → h2 for parts → h3 for sub-sections)
- Skip links for screen readers
- TOC links navigate properly with announcement to screen readers
- Two-column layout collapses cleanly on mobile
- Side-by-side cards in Part 3 stack on mobile
- Print stylesheet included (people may want to print this)
- prefers-reduced-motion respected for the IntersectionObserver scroll-spy behaviour

### Print stylesheet

Add a print stylesheet (`@media print`):
- Hide top nav, footer, Telegram button, TOC sidebar
- Reset background to white, text to black
- Ensure proper page breaks before each Part heading
- Print at standard A4 / Letter sizes
- Include URL and date in print footer

## Verification before commit

1. Visit http://localhost:3000/risk-disclosure
2. All 9 parts render with proper formatting
3. TOC sidebar sticky-scrolls correctly
4. Active TOC link highlights based on scroll position
5. Direct anchor links work (e.g., `/risk-disclosure#part-3`)
6. Part 3 responsibility split renders as cards
7. Part 5 acknowledgments render as visual cards (no functional checkboxes)
8. CTAs link to /signup correctly
9. Mobile responsive: TOC collapses to dropdown, side-by-side cards stack
10. Print preview renders cleanly
11. `pnpm typecheck` and `pnpm lint` clean
12. Lighthouse: Accessibility ≥ 95, SEO ≥ 95

## Suggested commit message

feat: Phase 2 Prompt 7 — risk disclosure read-only view

- Loads /HayPlusbot-Risk-Disclosure.md content at build time
- Two-column layout: 9-part content + sticky TOC sidebar
- Part 3 responsibility split renders as side-by-side cards
- Part 5 acknowledgments render as visual cards (read-only, no checkboxes)
- IntersectionObserver scroll-spy for active TOC item
- Print stylesheet for offline reading
- Sign-up CTAs at top callout and bottom block
- SEO metadata with Article schema
- Indexed by search engines (no noindex)
```

---

## After Phase 2 is complete

Once all four prompts are committed and pushed, you'll have a complete public marketing surface. Realistic outcomes:

- Landing page is your primary conversion surface — invest iteration time here
- How-it-works is your educational deep-dive — supports trust building
- FAQ handles common objections and supports SEO
- Risk disclosure satisfies legal disclosure requirements pre-signup

**Next: Phase 3 (broker integration + subscribe flow).** This is where the IB referral verification, balance check, and HFcopy subscription handoff get built. It's also where Prompt 11.5 from PRD v3.3 (the two-tier balance gate with `subscribe_balance_check_log`) lives.

When you're ready for Phase 3, message me in a new chat and I'll produce those prompts. Phase 3 has external dependencies (HFM Partner API credentials, possibly Finnhub paid tier) that we should discuss before generating the prompts.

## What to do if a prompt produces something off

If Claude Code produces output that doesn't match the prototype or has issues:

1. Don't keep iterating endlessly in the same Claude Code session — context degrades
2. Note the specific issue
3. Roll back the commit if it's been committed
4. Start a fresh Claude Code session
5. Re-run the prompt with an additional clarification at the top: "Important: in the previous attempt, [specific issue]. Please ensure [specific correction]."

This usually fixes things faster than trying to course-correct in a long session.

## Final reminder

After each prompt, before committing, verify against the prototype HTML on multiple screen sizes. The prototype is the source of truth for visual design. If something doesn't match, the implementation is wrong, not the prototype.

Run them one at a time. Commit between each. Take breaks between prompts so you review with fresh eyes.

Good luck with Phase 2.
