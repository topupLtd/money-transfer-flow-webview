import { z } from "zod";

// ── Shared item shape for both lists ──

export const ReasonSourceItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type ReasonSourceItem = z.infer<typeof ReasonSourceItemSchema>;

// ── GET /v1/origin-of-funds ──

export const SourceOfFundsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ReasonSourceItemSchema),
  message: z.string().optional(),
});

export type SourceOfFundsResponse = z.infer<typeof SourceOfFundsResponseSchema>;

// ── GET /v1/transfer-reasons ──

export const TransferReasonsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ReasonSourceItemSchema),
  message: z.string().optional(),
});

export type TransferReasonsResponse = z.infer<typeof TransferReasonsResponseSchema>;

// ── PATCH /v1/transaction/reason-source ──

/** Custom "other" IDs that unlock free-text input (from RN ReasonOfTransfer.js) */
export const OTHER_REASON_ID = 11;
export const OTHER_SOURCE_ID = 8;

export interface UpdateReasonSourceBody {
  reason_id: number;
  origin_of_fund_id: number;
  transaction_id: string | number;
  /** Required when reason_id === 11 */
  other_transfer_reason?: string;
  /** Required when origin_of_fund_id === 8 */
  other_origin_of_fund?: string;
}

export const UpdateReasonSourceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export type UpdateReasonSourceResponse = z.infer<typeof UpdateReasonSourceResponseSchema>;
