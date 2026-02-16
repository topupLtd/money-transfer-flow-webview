/**
 * Currency API Service
 * Handles all currency & country related API calls
 */

import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import {
  CurrencyCountriesResponseSchema,
  type CurrencyCountry,
} from "../types/currency";

/**
 * Fetches the list of available currency-countries from the API.
 * Validates the response at runtime using Zod.
 *
 * @returns Parsed and validated array of CurrencyCountry objects
 * @throws ApiError on network / server failure
 * @throws ZodError if response shape doesn't match expected schema
 */
export async function getCurrencyCountries(): Promise<CurrencyCountry[]> {
  const raw = await api.get<unknown>(ENDPOINTS.CURRENCY_COUNTRIES);

  const parsed = CurrencyCountriesResponseSchema.parse(raw);

  return parsed.data;
}
