import { z } from "zod";

// ── Constants (mirrors paycell_0_81/src/constants/Config.js) ──

export const MINIMUM_SENDING_AMOUNT = 1;
export const EXCHANGE_RATE_SENDER_ERROR_CODE = 12001;
export const EXCHANGE_RATE_RECEIVER_ERROR_CODE = 13001;

// ── Transaction Quote ──

/** POST /v1/quote-user request body */
export interface TransactionQuoteBody {
  user_currency_countries_id: number;
  recipient_currency_countries_id: number;
  user_amount: string;
  recipient_amount: string;
  pickup_method_id: number;
  payment_method_id: string | number;
  transfer_time_id: number;
  promo_code?: string | null;
  unauth_promo?: string | null;
  recipient_account_no?: string;
}

export const TransactionQuoteDataSchema = z.object({
  transaction_id: z.union([z.string(), z.number()]),
}).passthrough();

export const TransactionQuoteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: TransactionQuoteDataSchema.optional(),
  errorCode: z.number().optional(),
  code: z.number().optional(),
});

export type TransactionQuoteData = z.infer<typeof TransactionQuoteDataSchema>;
export type TransactionQuoteResponse = z.infer<typeof TransactionQuoteResponseSchema>;

// ── Create Transaction ──

/** POST /v1/transaction request body */
export interface CreateTransactionBody {
  transaction_id: string | number;
}

export const CreateTransactionUserSchema = z.object({
  email_verified_at: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  status: z.number().optional(),
  occupation_id: z.number().nullable().optional(),
  has_compliance_issue: z.boolean().optional(),
  level_id: z.number().optional(),
}).passthrough();

export const CreateTransactionDataSchema = z.object({
  user: CreateTransactionUserSchema.optional(),
}).passthrough();

export const CreateTransactionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: CreateTransactionDataSchema.optional(),
  errorCode: z.number().optional(),
  code: z.number().optional(),
});

export type CreateTransactionUser = z.infer<typeof CreateTransactionUserSchema>;
export type CreateTransactionData = z.infer<typeof CreateTransactionDataSchema>;
export type CreateTransactionResponse = z.infer<typeof CreateTransactionResponseSchema>;
