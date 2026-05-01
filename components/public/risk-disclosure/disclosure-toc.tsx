"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/**
 * Sticky TOC sidebar with scroll-spy on desktop; on mobile it collapses
 * into a "Jump to section" disclosure at the top of the content column.
 */
export function DisclosureToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // skip auto-spy when user prefers reduced motion

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav
        aria-label="Table of contents"
        className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
          On this page
        </p>
        <ul className="mt-4 space-y-2 border-l border-white/[0.06]">
          {items.map((it) => {
            const isActive = activeId === it.id;
            return (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  className={cn(
                    "block border-l-2 px-3 py-1 text-sm transition-colors -ml-px",
                    isActive
                      ? "border-teal text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {it.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile collapsible disclosure */}
      <details
        open={mobileOpen}
        onToggle={(e) => setMobileOpen((e.currentTarget as HTMLDetailsElement).open)}
        className="rounded-xl border border-white/[0.06] bg-card lg:hidden"
      >
        <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <span>Jump to section</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
              mobileOpen && "rotate-180",
            )}
          />
        </summary>
        <ul className="border-t border-white/[0.06] px-2 py-2">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
