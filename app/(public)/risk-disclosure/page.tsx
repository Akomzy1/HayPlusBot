import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadDisclosure } from "@/lib/disclosure/parse";
import { DisclosureContent } from "@/components/public/risk-disclosure/disclosure-content";
import {
  DisclosureToc,
  type TocItem,
} from "@/components/public/risk-disclosure/disclosure-toc";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "Risk Disclosure — HayPlusbot Copy Trading";
const DESCRIPTION =
  "Risk disclosure for HayPlusbot's HFM HFcopy strategy. Trading risk, responsibility split, commercial arrangement, jurisdiction. Read before subscribing.";
const OG = `${SITE_URL}/api/og?title=${encodeURIComponent("Risk Disclosure")}&subtitle=${encodeURIComponent("Read before subscribing. 9 parts. ~8–10 minutes.")}`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://hayplusbot.com/risk-disclosure" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://hayplusbot.com/risk-disclosure",
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
  // intentionally indexed — this should be findable so users can read before signup
  robots: { index: true, follow: true },
};

export default async function RiskDisclosurePage() {
  const doc = await loadDisclosure();

  const tocItems: TocItem[] = doc.sections.map((s) => {
    if (s.kind === "intro") {
      return { id: s.id, label: s.title };
    }
    return { id: s.id, label: `Part ${s.num} — ${s.title}` };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: DESCRIPTION,
    inLanguage: "en-GB",
    datePublished: "2026-04-30",
    dateModified: "2026-05-01",
    author: { "@type": "Organization", name: "HayPlusbot" },
    publisher: {
      "@type": "Organization",
      name: "HayPlusbot",
      url: "https://hayplusbot.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://hayplusbot.com/risk-disclosure",
    },
  };

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
              "radial-gradient(60% 60% at 50% 0%, rgba(186,117,23,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-32 md:pb-16 md:pt-36">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber/80">
            Read before subscribing
          </p>
          <h1 className="mt-6 font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Risk Disclosure
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Read this before subscribing to HayPlusbot&rsquo;s strategy.
          </p>
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            Version {doc.version} &middot; Last updated {doc.effectiveDate}
          </p>

          <div
            className="mt-8 flex flex-col gap-3 rounded-xl border p-5 print:hidden sm:flex-row sm:items-center sm:gap-5"
            style={{
              background: "rgba(186, 117, 23, 0.10)",
              borderColor: "rgba(186, 117, 23, 0.45)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-amber"
                style={{ background: "rgba(186, 117, 23, 0.15)" }}
              >
                <AlertTriangle className="h-4 w-4" />
              </span>
              <p className="text-sm text-foreground">
                <span className="font-medium">Ready to subscribe?</span>{" "}
                <span className="text-muted-foreground">
                  You&rsquo;ll need to acknowledge this disclosure as part of
                  signup.
                </span>
              </p>
            </div>
            <div className="sm:ml-auto">
              <Button asChild size="sm" className="bg-amber hover:bg-amber/90">
                <Link href="/signup">
                  Sign up to acknowledge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Body: TOC + content */}
      <section className="border-b border-white/[0.06] bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_240px]">
            <div className="min-w-0 max-w-[760px]">
              <div className="print:hidden lg:hidden">
                <DisclosureToc items={tocItems} />
              </div>
              <div className="mt-8 lg:mt-0">
                <DisclosureContent sections={doc.sections} />
              </div>

              {/* Bottom CTA */}
              <section className="mt-16 rounded-xl border border-white/[0.06] bg-card p-8 print:hidden">
                <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Ready to subscribe?
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  If you&rsquo;ve read the above and want to proceed, sign up to
                  formally acknowledge this disclosure and continue to
                  subscription.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="bg-teal hover:bg-teal/90">
                    <Link href="/signup">
                      Sign up
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground/80">
                  Acknowledgment is mandatory before accessing performance
                  data, signal archive, or subscribing on HFcopy.
                </p>
              </section>

              {/* Document version footer */}
              <footer className="mt-12 border-t border-white/[0.06] pt-8 font-mono text-xs text-muted-foreground/70">
                <p>Version {doc.version}</p>
                <p>Last updated {doc.effectiveDate}</p>
                <p className="mt-2">
                  Document hash: hash will be generated at signing.
                </p>
                <p className="mt-2">
                  Questions?{" "}
                  <a
                    href="mailto:hello@hayplusbot.com"
                    className="text-teal underline-offset-4 hover:underline"
                  >
                    hello@hayplusbot.com
                  </a>
                </p>
              </footer>
            </div>

            {/* Desktop TOC sidebar */}
            <aside className="print:hidden">
              <DisclosureToc items={tocItems} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
