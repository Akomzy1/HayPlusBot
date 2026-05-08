import { z } from "zod";

export const RecordSchema = z.object({
  hfmAccountNumber: z
    .string()
    .regex(/^\d{8}$/, "Account number must be 8 digits"),
  server: z.enum(["HFM-Real", "HFM-Real-Plus", "HFM-Real-Pro"]),
});

export type RecordResult =
  | { success: true }
  | {
      success?: false;
      error: string;
      code: "AUTH_REQUIRED" | "INVALID_INPUT" | "DB_ERROR";
    };
