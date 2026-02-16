/**
 * Currency & Country types and Zod schemas
 * Strict runtime validation for API responses
 * Based on the actual /currency-countries endpoint response
 */

import { z } from "zod";

// ── Zod Schemas ────────────────────────────────────────────────────

export const CurrencySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  decimal_places: z.number(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  flag: z.string().nullable(),
  type: z.enum(["from", "to"]),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  code_3: z.string(),
  dialing_code: z.string(),
  continent: z.string().nullable(),
  risk_level: z.string(),
  fraud_risk: z.string(),
  url: z.string(),
});

export const PickupMethodSchema = z.object({
  id: z.number(),
  priority: z.number(),
  ref_id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  corridor_id: z.number(),
});

export const CurrencyCountrySchema = z.object({
  id: z.number(),
  currency_id: z.number(),
  country_id: z.number(),
  flag: z.string().nullable(),
  type: z.enum(["from", "to", "both"]),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  tax: z.string().nullable(),
  tax_type: z.string(),
  currency: CurrencySchema,
  country: CountrySchema,
  pickup_methods: z.array(PickupMethodSchema),
});

export const AppInfoSchema = z.object({
  force_update: z.boolean(),
  android: z.string(),
  ios: z.string(),
});

export const CurrencyCountriesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  app: AppInfoSchema.optional(),
  data: z.array(CurrencyCountrySchema),
});

// ── TypeScript Types (derived from schemas) ────────────────────────

export type Currency = z.infer<typeof CurrencySchema>;
export type Country = z.infer<typeof CountrySchema>;
export type PickupMethod = z.infer<typeof PickupMethodSchema>;
export type CurrencyCountry = z.infer<typeof CurrencyCountrySchema>;
export type CurrencyCountriesResponse = z.infer<typeof CurrencyCountriesResponseSchema>;
