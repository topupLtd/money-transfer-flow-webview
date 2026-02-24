import { z } from "zod";

export const ExchangeRateDataSchema = z.object({
  rate: z.number(),
  errorCode: z.number().optional(),
  errorMessage: z.string().optional(),
});

export const ExchangeRateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: ExchangeRateDataSchema,
});

export type ExchangeRateData = z.infer<typeof ExchangeRateDataSchema>;
export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>;

/** Request body for POST /v2/exchange-rate */
export interface ExchangeRateBody {
  user_currency_countries_id: number;
  recipient_currency_countries_id: number;
  sendDeliveryMethod: number;
  receiveDeliveryMethod: number;
  tranType: number;
  amount: number | string;
  recipient_amount: number | string;
  is_donation?: boolean;
}
