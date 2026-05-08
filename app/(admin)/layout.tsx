import Link from "next/link";
import { requireAdmin } from "@/lib/auth/get-user";
import { Logo } from "@/components/marketing/logo";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/hfm-sync", label: "HFM sync" },
];

/**
 * Admin shell. requireAdmin() runs server-side on every render; non-admins
 * get notFound() (the rendered 404 page). Middleware also enforces this at
 * the edge so admin routes are 404 to non-admins by default.
 *
 * Desktop-only per CLAUDE.md (admin dashboard is 1024px+).
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/[0.06] print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Logo />
            <span
              aria-label="Admin section"
              className="rounded-md bg-amber/15 px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-amber"
            >
              Admin
            </span>
            <nav aria-label="Admin">
              <ul className="flex items-center gap-5">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
