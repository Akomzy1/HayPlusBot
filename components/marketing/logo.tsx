import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * HayPlusbot logo. Diamond (rotated rounded square) frame in brand teal,
 * white "H" with a teal crossbar, plus a small teal "+" sign next to it.
 * Inline SVG so it scales perfectly with the wordmark and avoids an
 * extra HTTP request. The same SVG is also at /public/brand/logo.svg
 * for favicon and any external use.
 */
export function Logo({
  className,
  href = "/",
  monogramOnly = false,
  size = 28,
}: {
  className?: string;
  href?: string | null;
  monogramOnly?: boolean;
  size?: number;
}) {
  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-sans font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        role="img"
        aria-label="HayPlusbot"
        className="shrink-0"
      >
        <g transform="rotate(45 32 32)">
          <rect
            x="6"
            y="6"
            width="52"
            height="52"
            rx="12"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="4.4"
            strokeLinejoin="round"
          />
        </g>
        {/* H */}
        <rect x="20" y="19" width="4.6" height="26" rx="2.1" fill="#F5F6F8" />
        <rect x="33.4" y="19" width="4.6" height="26" rx="2.1" fill="#F5F6F8" />
        <rect x="20" y="29.5" width="18" height="3.6" rx="1.4" fill="#1D9E75" />
        {/* + */}
        <rect x="44" y="25" width="3.4" height="13.2" rx="1.2" fill="#1D9E75" />
        <rect x="41.2" y="29.6" width="9" height="3.4" rx="1.2" fill="#1D9E75" />
      </svg>
      {monogramOnly ? null : <span>HayPlusbot</span>}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="HayPlusbot home">
      {inner}
    </Link>
  );
}
