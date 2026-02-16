import { z } from "zod";

export const DeliveryFeeSchema = z.object({
  min: z.number(),
  max: z.number(),
  type: z.string(), // "PERCENTAGE" | "FIXED"
  fee: z.number(),
  test: z.number().optional(),
});

export const TransferTimeSchema = z.object({
  id: z.number(),
  name: z.string(),
  fees: z.array(DeliveryFeeSchema),
});

export const DeliveryMethodSchema = z.object({
  id: z.number(),
  corridor_id: z.number(),
  priority: z.number(),
  name: z.string(),
  description: z.string(),
  transfer_time: z.array(TransferTimeSchema),
});

export const AvailableDeliveriesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  app: z.unknown().nullable(),
  data: z.array(DeliveryMethodSchema),
});

export type DeliveryFee = z.infer<typeof DeliveryFeeSchema>;
export type TransferTime = z.infer<typeof TransferTimeSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;
export type AvailableDeliveriesResponse = z.infer<typeof AvailableDeliveriesResponseSchema>;
