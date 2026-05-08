"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRef, useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  reconcileHfcopySubscribers,
  sendVerificationEmailToUnmatched,
} from "../actions";
import type { ReconcileResult, SendVerificationResult } from "../schema";
import { cn } from "@/lib/utils";

const initialState: ReconcileResult | null = null;

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={!hasFile || pending}
      className="bg-teal hover:bg-teal/90"
    >
      {pending ? "Processing…" : "Process upload"}
    </Button>
  );
}

export function UploadForm() {
  const [state, formAction] = useFormState(
    reconcileHfcopySubscribers,
    initialState,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function pickFile() {
    inputRef.current?.click();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      setFileName(file.name);
    }
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload CSV file"
          onClick={pickFile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              pickFile();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal",
            dragOver
              ? "border-teal/60 bg-teal/[0.06]"
              : "border-white/[0.08] bg-card/40 hover:bg-card/60",
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-foreground">
            {fileName ? (
              <>
                <span className="font-mono">{fileName}</span> selected
              </>
            ) : (
              <>Drag a CSV file here, or click to browse</>
            )}
          </p>
          <p className="text-xs text-muted-foreground/70">
            Expected columns: account_number, status, registration_date.
            Other columns ignored. Max 10MB.
          </p>
          <input
            ref={inputRef}
            type="file"
            name="csv"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            required
          />
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

        <SubmitButton hasFile={Boolean(fileName)} />
      </form>

      {state && "success" in state && state.success ? (
        <ReconcileSummary state={state} />
      ) : null}
    </div>
  );
}

function ReconcileSummary({
  state,
}: {
  state: Extract<ReconcileResult, { success: true }>;
}) {
  const s = state.summary;
  const stats: { label: string; value: number; tone?: "teal" | "amber" }[] = [
    { label: "Total accounts in upload", value: s.totalInUpload },
    { label: "Active accounts", value: s.activeInUpload },
    { label: "Newly verified", value: s.newlyVerified, tone: "teal" },
    { label: "Newly subscribed", value: s.newlySubscribed, tone: "teal" },
    {
      label: "Newly unsubscribed",
      value: s.newlyUnsubscribed,
      tone: "amber",
    },
    { label: "Already subscribed (unchanged)", value: s.alreadySubscribed },
    {
      label: "Unmatched HayPlusbot users",
      value: s.unmatchedCount,
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-teal/40 bg-teal/[0.06] p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal/15 text-teal">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-sans text-base font-semibold text-foreground">
              Reconciliation complete
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-md border border-white/[0.06] bg-card px-4 py-3"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
                    {s.label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 font-mono text-xl",
                      s.tone === "teal" && "text-teal",
                      s.tone === "amber" && "text-amber",
                      !s.tone && "text-foreground",
                    )}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {state.unmatchedUsers.length > 0 ? (
        <UnmatchedList users={state.unmatchedUsers} />
      ) : null}
    </div>
  );
}

function UnmatchedList({
  users,
}: {
  users: Extract<ReconcileResult, { success: true }>["unmatchedUsers"];
}) {
  return (
    <details className="rounded-xl border border-white/[0.06] bg-card">
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Unmatched HayPlusbot users ({users.length})
        </span>
      </summary>
      <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
        {users.map((u) => (
          <UnmatchedRow key={u.id} user={u} />
        ))}
      </ul>
    </details>
  );
}

function UnmatchedRow({
  user,
}: {
  user: Extract<ReconcileResult, { success: true }>["unmatchedUsers"][number];
}) {
  const [state, action] = useFormState<SendVerificationResult | null, FormData>(
    sendVerificationEmailToUnmatched,
    null,
  );
  const sent = Boolean(state && "success" in state && state.success);
  const errorMsg = state && "error" in state ? state.error : null;
  return (
    <li className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        <span className="font-mono text-foreground">{user.emailMasked}</span>
        <span className="mx-2 text-muted-foreground/50">·</span>
        <span className="font-mono text-muted-foreground">
          HFM #{user.account}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <form action={action}>
          <input type="hidden" name="user_id" value={user.user_id} />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={sent}
          >
            <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {sent ? "Email logged" : "Send verification email"}
          </Button>
        </form>
        {errorMsg ? (
          <span className="text-xs text-destructive">{errorMsg}</span>
        ) : null}
      </div>
    </li>
  );
}
