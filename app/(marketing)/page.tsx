import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { ForexTicker } from "@/components/marketing/forex-ticker";
import { PerformanceTeaser } from "@/components/marketing/performance-teaser";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { StrategyFeatures } from "@/components/marketing/strategy-features";
import { SimplicityCards } from "@/components/marketing/simplicity-cards";
import { RecentSignals } from "@/components/marketing/recent-signals";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { RiskCallout } from "@/components/marketing/risk-callout";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "HayPlusbot — AI Forex Copy-Trading Strategy on HFM's HFcopy",
  description:
    "Subscribe to an authorised HFM copy-trading strategy. SMC/ICT A+ setups across 9 pairs. Free signup. Transparent performance. Trade only what qualifies.",
  alternates: {
    canonical: "https://hayplusbot.com/",
  },
  openGraph: {
    title: "HayPlusbot — AI Forex Copy-Trading Strategy on HFM's HFcopy",
    description:
      "Subscribe to an authorised HFM copy-trading strategy. SMC/ICT A+ setups across 9 pairs. Free signup. Transparent performance.",
    url: "https://hayplusbot.com/",
    siteName: "HayPlusbot",
    images: [
      {
        url: `${SITE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: "HayPlusbot — AI forex copy-trading strategy on HFM's HFcopy",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HayPlusbot — AI Forex Copy-Trading Strategy on HFM's HFcopy",
    description:
      "Subscribe to an authorised HFM copy-trading strategy. SMC/ICT A+ setups across 9 pairs.",
    images: [`${SITE_URL}/api/og`],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "HayPlusbot Copy-Trading Strategy",
  serviceType: "Copy trading",
  description:
    "Managed AI-driven SMC/ICT copy-trading strategy on HFM's HFcopy platform. 9 forex pairs, London and NY AM sessions, deterministic A+ setup detection.",
  provider: {
    "@type": "Organization",
    name: "HayPlusbot",
    url: "https://hayplusbot.com",
  },
  areaServed: {
    "@type": "Country",
    name: "Worldwide",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ForexTicker />
      <PerformanceTeaser />
      <HowItWorks />
      <StrategyFeatures />
      <SimplicityCards />
      <RecentSignals />
      <LandingFaq />
      <RiskCallout />
    </>
  );
}
