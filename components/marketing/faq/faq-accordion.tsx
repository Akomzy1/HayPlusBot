"use client";

import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import {
  FAQ_CATEGORIES,
  FAQ_QUESTIONS,
  type FaqCategoryId,
  type FaqQuestion,
} from "./data";
import { FaqSearch } from "./faq-search";
import { CategoryTabs } from "./category-tabs";

type Active = "all" | FaqCategoryId;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const re = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark
            key={i}
            className="rounded-sm bg-teal/25 px-0.5 text-foreground"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function FaqAccordion() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState<Active>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // debounce search input by 150ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  // open + scroll to question targeted by URL hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash.replace("#", "");
    if (!h || !FAQ_QUESTIONS.some((q) => q.id === h)) return;
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.add(h);
      return next;
    });
    requestAnimationFrame(() => {
      const el = document.getElementById(h);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const counts = useMemo(() => {
    const c: Record<Active, number> = { all: FAQ_QUESTIONS.length } as Record<
      Active,
      number
    >;
    for (const cat of FAQ_CATEGORIES) {
      c[cat.id] = FAQ_QUESTIONS.filter((q) => q.category === cat.id).length;
    }
    return c;
  }, []);

  const filtered = useMemo<FaqQuestion[]>(() => {
    const q = debounced.trim().toLowerCase();
    return FAQ_QUESTIONS.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [debounced, category]);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        if (typeof window !== "undefined") {
          history.replaceState(null, "", `#${id}`);
        }
      }
      return next;
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
      const target = filtered[next];
      if (target) buttonRefs.current[target.id]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      const target = filtered[0];
      if (target) buttonRefs.current[target.id]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const target = filtered[filtered.length - 1];
      if (target) buttonRefs.current[target.id]?.focus();
    } else if (e.key === "Escape") {
      const id = filtered[idx]?.id;
      if (id && openIds.has(id)) toggle(id);
    }
  }

  return (
    <div className="space-y-6">
      <FaqSearch
        value={search}
        onChange={setSearch}
        resultCount={filtered.length}
      />
      <CategoryTabs active={category} onChange={setCategory} counts={counts} />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.08] bg-card/40 px-6 py-10 text-center">
          <p className="font-sans text-base text-foreground">
            No results found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a shorter search term, or pick a different category.
          </p>
        </div>
      ) : (
        <ul
          id="faq-list"
          role="region"
          aria-label="Frequently asked questions"
          className="space-y-3"
        >
          {filtered.map((q, idx) => {
            const isOpen = openIds.has(q.id);
            const buttonId = `${q.id}-button`;
            const panelId = `${q.id}-panel`;
            return (
              <li
                key={q.id}
                id={q.id}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-card scroll-mt-24"
              >
                <h3 className="m-0">
                  <button
                    ref={(el) => {
                      buttonRefs.current[q.id] = el;
                    }}
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(q.id)}
                    onKeyDown={(e) => onKeyDown(e, idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  >
                    <span className="font-sans text-base font-medium text-foreground">
                      <Highlight text={q.question} query={debounced} />
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="min-h-0">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      <Highlight text={q.answer} query={debounced} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
