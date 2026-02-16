import { useQuery } from "@tanstack/react-query";
import {
  getAvailableDeliveries,
  type GetAvailableDeliveriesBody,
} from "@/api/services/delivery";
import type { DeliveryMethod } from "@/api/types/delivery";

export const AVAILABLE_DELIVERIES_KEY = ["available-deliveries"] as const;

/**
 * Fetches available pickup methods & transfer times for a given
 * sender/recipient currency-country pair.
 *
 * Mirrors `fetchDeliveriesAndSetDefault` from RateCheckScreen.js —
 * the query is keyed on both currency-country IDs so it automatically
 * re-fetches when the user changes the destination country.
 */
export function useAvailableDeliveries(
  recipientCurrencyCountryId: number | null | undefined,
  senderCurrencyCountryId: number = 3,
) {
  return useQuery<DeliveryMethod[], Error>({
    queryKey: [
      ...AVAILABLE_DELIVERIES_KEY,
      senderCurrencyCountryId,
      recipientCurrencyCountryId,
    ],
    queryFn: () => {
      const body: GetAvailableDeliveriesBody = {
        user_currency_countries_id: senderCurrencyCountryId,
        recipient_currency_countries_id: recipientCurrencyCountryId!,
      };
      return getAvailableDeliveries(body);
    },
    enabled: !!recipientCurrencyCountryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if ("status" in error && typeof (error as any).status === "number") {
        const status = (error as any).status as number;
        if (status >= 400 && status < 500) return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}
