import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowItWorksHero } from "@/components/marketing/how-it-works/hero";
import { SmcExplanation } from "@/components/marketing/how-it-works/smc-explanation";
import { ConfluenceFactors } from "@/components/marketing/how-it-works/confluence-factors";
import { FundamentalFilters } from "@/components/marketing/how-it-works/fundamental-filters";
import { PairsAndSessions } from "@/components/marketing/how-it-works/pairs-and-sessions";
import { ParticipationSteps } from "@/components/marketing/how-it-works/participation-steps";
import { Differentiators } from "@/components/marketing/how-it-works/differentiators";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "How HayPlusbot Works — SMC/ICT Strategy Methodology";
const DESCRIPTION =
  "Smart Money Concepts methodology applied across 9 forex pairs. London and NY AM sessions only. 7 confluence factors plus fundamental filters. Disciplined, rule-based execution.";
const OG = `${SITE_URL}/api/og?title=${encodeURIComponent("How HayPlusbot trades.")}&subtitle=${encodeURIComponent("SMC/ICT methodology, 9 pairs, London + NY AM. Rule-based, no overrides.")}`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://hayplusbot.com/how-it-works" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://hayplusbot.com/how-it-works",
    siteName: "HayPlusbot",
    images: [{ url: OG, width: 1200, height: 630, alt: TITLE }],
    locale: "en_GB",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How HayPlusbot Works — SMC/ICT Strategy Methodology",
  description: DESCRIPTION,
  about: [
    { "@type": "Thing", name: "Smart Money Concepts" },
    { "@type": "Thing", name: "ICT Inner Circle Trader methodology" },
    { "@type": "Thing", name: "Forex copy trading" },
  ],
  author: { "@type": "Organization", name: "HayPlusbot" },
  publisher: {
    "@type": "Organization",
    name: "HayPlusbot",
    url: "https://hayplusbot.com",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://hayplusbot.com/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HowItWorksHero />
      <SmcExplanation />
      <ConfluenceFactors />
      <FundamentalFilters />
      <PairsAndSessions />
      <ParticipationSteps />
      <Differentiators />

      {/* CTA block */}
      <section className="border-b border-white/[0.06] bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ready to subscribe?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Free signup. Email verification only. Disclosure signing first &mdash;
            then HFM account, then HFcopy subscription.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="bg-teal hover:bg-teal/90">
              <Link href="/signup">
                Sign up
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/faq">Read the FAQ first</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
