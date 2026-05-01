"use client";

import { cn } from "@/lib/utils";
import { FAQ_CATEGORIES, type FaqCategoryId } from "./data";

const TABS: { id: "all" | FaqCategoryId; name: string }[] = [
  { id: "all", name: "All" },
  ...FAQ_CATEGORIES,
];

export function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: "all" | FaqCategoryId;
  onChange: (next: "all" | FaqCategoryId) => void;
  counts: Record<"all" | FaqCategoryId, number>;
}) {
  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      className="flex gap-1 overflow-x-auto border-b border-white/[0.06] pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="faq-list"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative shrink-0 whitespace-nowrap px-4 py-3 text-sm transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.name}
            <span className="ml-2 font-mono text-[11px] text-muted-foreground/60">
              {counts[t.id]}
            </span>
            {isActive ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-px h-[3px] rounded-t bg-teal"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
