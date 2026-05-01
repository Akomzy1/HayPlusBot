"use client";

import { Search, X } from "lucide-react";
import { useId } from "react";

export function FaqSearch({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (next: string) => void;
  resultCount: number;
}) {
  const inputId = useId();
  const liveId = useId();
  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        Search frequently asked questions
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions..."
        autoComplete="off"
        aria-describedby={liveId}
        className="block w-full rounded-md border border-input bg-secondary px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <p id={liveId} className="sr-only" role="status" aria-live="polite">
        {value
          ? `${resultCount} ${resultCount === 1 ? "question" : "questions"} match your search`
          : ""}
      </p>
    </div>
  );
}
