import { z } from "zod";

// ── Recipient Address ──

export const RecipientCountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  dialing_code: z.string().optional(),
}).passthrough();

export const RecipientAddressSchema = z.object({
  country_id: z.number().optional(),
  country: RecipientCountrySchema,
  line1: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  post: z.string().nullable().optional(),
}).passthrough();

// ── Recipient ──

export const RecipientSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  relation_id: z.number().nullable().optional(),
  dialing_code: z.string().nullable().optional(),
  country_id: z.number().optional(),
  currency_id: z.number().optional(),
  currency_country_id: z.number().optional(),
  account_no: z.string().nullable().optional(),
  parent_id: z.number().nullable().optional(),
  rib: z.string().nullable().optional(),
  pickup_method_id: z.number().nullable().optional(),
  institution_name: z.string().nullable().optional(),
  institution_type: z.string().nullable().optional(),
  institution_id: z.union([z.string(), z.number()]).nullable().optional(),
  avatar: z.string().nullable().optional(),
  address: RecipientAddressSchema,
}).passthrough();

export const RecipientsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(RecipientSchema),
});

export type RecipientCountry = z.infer<typeof RecipientCountrySchema>;
export type RecipientAddress = z.infer<typeof RecipientAddressSchema>;
export type Recipient = z.infer<typeof RecipientSchema>;
export type RecipientsResponse = z.infer<typeof RecipientsResponseSchema>;

// ── Update Transaction With Recipient (PATCH /v1/transaction) ──

export interface UpdateTransactionWithRecipientBody {
  transaction_id: string | number;
  recipient_id: number;
}

export const UpdateTransactionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export type UpdateTransactionResponse = z.infer<typeof UpdateTransactionResponseSchema>;

// ── Parent Recipients (GET /v1/recipient/parents) ──

export const PickupMethodSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  option: z.string().optional(),
}).passthrough();

export type PickupMethod = z.infer<typeof PickupMethodSchema>;

export const ParentRecipientsDataSchema = z.object({
  recipients: z.array(RecipientSchema),
  pickup_methods: z.array(PickupMethodSchema),
}).passthrough();

export const ParentRecipientsResponseSchema = z.object({
  success: z.boolean().optional(),
  data: ParentRecipientsDataSchema,
  message: z.string().optional(),
}).passthrough();

export type ParentRecipientsData = z.infer<typeof ParentRecipientsDataSchema>;
export type ParentRecipientsResponse = z.infer<typeof ParentRecipientsResponseSchema>;
