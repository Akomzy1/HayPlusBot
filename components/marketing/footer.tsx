import Link from "next/link";
import { Send } from "lucide-react";
import { Logo } from "./logo";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/risk-disclosure", label: "Risk disclosure" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  const telegramUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL ?? "https://t.me/hayplusbot";
  return (
    <footer className="border-t border-white/[0.06] bg-background print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-md text-xs text-muted-foreground">
              HayPlusbot is an authorised strategy provider on HFM&rsquo;s
              HFcopy platform. HayPlusbot Nigeria, Lagos.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
          <p className="font-mono text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} HayPlusbot
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HayPlusbot on Telegram"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Send size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
