/**
 * React Query hook for currency-country data
 * Provides loading, error, and data states with proper caching
 */

import { useQuery } from "@tanstack/react-query";
import { getCurrencyCountries } from "@/api/services/currency";
import type { CurrencyCountry } from "@/api/types/currency";

/** Query key constant for cache identity */
export const CURRENCY_COUNTRIES_KEY = ["currency-countries"] as const;

/**
 * Fetches and caches the list of currency-countries.
 *
 * - Caches for 5 minutes (staleTime)
 * - Keeps previous data in cache for 10 minutes (gcTime)
 * - Retries only on network failures (up to 2 attempts)
 * - Fully typed return value
 */
export function useCurrencyCountries() {
  return useQuery<CurrencyCountry[], Error>({
    queryKey: [...CURRENCY_COUNTRIES_KEY],
    queryFn: getCurrencyCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Only retry on network errors, not on 4xx/5xx
      if ("status" in error && typeof (error as any).status === "number") {
        const status = (error as any).status as number;
        if (status >= 400 && status < 500) return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}
