import type { Metadata } from "next";
import { FaqAccordion } from "@/components/marketing/faq/faq-accordion";
import { FAQ_QUESTIONS } from "@/components/marketing/faq/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "HayPlusbot FAQ — Common Questions About HFcopy Strategy";
const DESCRIPTION =
  "Everything you need to know about subscribing to HayPlusbot's HFM HFcopy strategy. Onboarding, performance, risk, technical details.";
const OG = `${SITE_URL}/api/og?title=${encodeURIComponent("HayPlusbot FAQ")}&subtitle=${encodeURIComponent("Subscribing, performance, risk, technical — answered.")}`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://hayplusbot.com/faq" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://hayplusbot.com/faq",
    siteName: "HayPlusbot",
    images: [{ url: OG, width: 1200, height: 630, alt: TITLE }],
    locale: "en_GB",
    type: "website",
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
  "@type": "FAQPage",
  mainEntity: FAQ_QUESTIONS.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: q.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(29,158,117,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-32 md:pb-16 md:pt-36">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
            Frequently asked
          </p>
          <h1 className="mt-6 font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Questions, answered.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {FAQ_QUESTIONS.length} questions across 5 categories. Search, browse
            by topic, or jump straight to whatever you&rsquo;re looking for.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="border-b border-white/[0.06] bg-background">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <FaqAccordion />
        </div>
      </section>

      {/* Still have questions? callout */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-xl border border-white/[0.06] bg-card p-6 text-center sm:p-8">
            <h2 className="font-sans text-xl font-semibold text-foreground sm:text-2xl">
              Still have questions?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Can&rsquo;t find your answer? Email us at{" "}
              <a
                href="mailto:hello@hayplusbot.com"
                className="text-teal underline-offset-4 hover:underline"
              >
                hello@hayplusbot.com
              </a>
              . We respond within 72 hours.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
