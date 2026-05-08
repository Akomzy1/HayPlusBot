"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSubscriberCount } from "../actions";
import type { CountUpdateResult } from "../schema";

const initialState: CountUpdateResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-teal hover:bg-teal/90"
    >
      {pending ? "Updating…" : "Update count"}
    </Button>
  );
}

export function CountUpdateForm({
  currentCount,
}: {
  currentCount: number | null;
}) {
  const [state, action] = useFormState(updateSubscriberCount, initialState);
  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-white/[0.06] bg-card/40 px-4 py-3 text-sm">
        Current displayed count:{" "}
        <span className="font-mono text-foreground">
          {currentCount ?? "—"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="count">New count</Label>
          <Input
            id="count"
            name="count"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            required
            placeholder="247"
            className="font-mono"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason note (audit log)</Label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          required
          minLength={3}
          maxLength={500}
          placeholder="Reconciled against HFM Partner Area export of 2026-05-08."
          className="block w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground/70">
          Required. Stored in admin_action_log alongside the count change.
        </p>
      </div>

      {state && "error" in state && state.error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      ) : null}

      {state && "success" in state && state.success ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-teal/40 bg-teal/[0.06] p-3 text-sm"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
          <span className="text-foreground">
            Count updated:{" "}
            <span className="font-mono">
              {state.previousCount ?? "—"} → {state.newCount}
            </span>
          </span>
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
