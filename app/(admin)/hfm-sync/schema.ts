import { z } from "zod";
import type { ReconciliationSummary } from "./reconcile-logic";

export const SubscriberCountSchema = z.object({
  count: z
    .number()
    .int({ message: "Must be a whole number" })
    .nonnegative({ message: "Must be zero or greater" }),
  reason: z
    .string()
    .trim()
    .min(3, { message: "Reason note must be at least 3 characters" })
    .max(500, { message: "Reason note must be 500 characters or fewer" }),
});

export const MAX_CSV_BYTES = 10 * 1024 * 1024; // 10 MB

export type ReconcileResult =
  | {
      success: true;
      summary: ReconciliationSummary;
      unmatchedUsers: { id: string; user_id: string; emailMasked: string; account: string }[];
    }
  | { success?: false; error: string };

export type CountUpdateResult =
  | { success: true; previousCount: number | null; newCount: number }
  | { success?: false; error: string };

export type SendVerificationResult =
  | { success: true }
  | { success?: false; error: string };
