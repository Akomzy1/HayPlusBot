"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-coral/70">
          Error
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page hit an unexpected error. Try again, or come back in a moment.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground/60">
            Reference: {error.digest}
          </p>
        ) : null}
        <Button onClick={() => reset()} className="mt-8 bg-teal hover:bg-teal/90">
          Try again
        </Button>
      </div>
    </main>
  );
}
