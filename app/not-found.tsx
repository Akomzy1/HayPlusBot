import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground/70">
          404
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Button asChild className="mt-8 bg-teal hover:bg-teal/90">
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    </main>
  );
}
