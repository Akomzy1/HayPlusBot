"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";

export function TelegramButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const url =
    process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL ?? "https://t.me/hayplusbot";

  return (
    <div
      className="fixed bottom-4 right-4 z-50 print:hidden sm:bottom-6 sm:right-6"
      aria-hidden={!visible}
    >
      {showTooltip ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-card px-3 py-1.5 text-xs text-foreground shadow-lg ring-1 ring-white/[0.06]"
        >
          Join our Telegram channel
        </span>
      ) : null}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open HayPlusbot Telegram channel in new tab"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          boxShadow: "0 4px 12px rgba(29, 158, 117, 0.3)",
        }}
        className={[
          "flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white",
          "transition-all duration-200 ease-out hover:scale-105 hover:shadow-[0_6px_18px_rgba(29,158,117,0.45)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "sm:h-14 sm:w-14",
          "motion-reduce:transition-none",
          visible
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-50 opacity-0",
        ].join(" ")}
      >
        <Send className="h-5 w-5 sm:h-6 sm:w-6" />
      </a>
    </div>
  );
}
