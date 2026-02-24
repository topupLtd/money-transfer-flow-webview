import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "@/api/services/exchange-rate";
import type { ExchangeRateBody, ExchangeRateResponse } from "@/api/types/exchange-rate";

export const EXCHANGE_RATE_KEY = ["exchange-rate"] as const;

/**
 * React Query hook that mirrors RateCheckScreen.js `setExchangeRate`.
 *
 * Automatically (re-)fetches the exchange rate whenever its dependencies change:
 *  - sender / recipient currency-country IDs
 *  - delivery method & transfer time IDs
 *  - send amount & receive amount
 *
 * The query is **enabled** only when the minimum required IDs are present.
 */
export function useExchangeRate(params: {
  userCurrencyCountryId: number | null | undefined;
  recipientCurrencyCountryId: number | null | undefined;
  sendDeliveryMethod: number | null | undefined;
  receiveDeliveryMethod: number | null | undefined;
  tranType: number | null | undefined;
  amount: number | string;
  recipientAmount: number | string;
  isDonation?: boolean;
}) {
  const {
    userCurrencyCountryId,
    recipientCurrencyCountryId,
    sendDeliveryMethod,
    receiveDeliveryMethod,
    tranType,
    amount,
    recipientAmount,
    isDonation,
  } = params;

  const enabled =
    !!userCurrencyCountryId &&
    !!recipientCurrencyCountryId &&
    !!receiveDeliveryMethod &&
    !!tranType;

  return useQuery<ExchangeRateResponse, Error>({
    queryKey: [
      ...EXCHANGE_RATE_KEY,
      userCurrencyCountryId,
      recipientCurrencyCountryId,
      sendDeliveryMethod,
      receiveDeliveryMethod,
      tranType,
      amount,
      recipientAmount,
    ],
    queryFn: () => {
      const body: ExchangeRateBody = {
        user_currency_countries_id: userCurrencyCountryId!,
        recipient_currency_countries_id: recipientCurrencyCountryId!,
        sendDeliveryMethod: sendDeliveryMethod ?? 1,
        receiveDeliveryMethod: receiveDeliveryMethod!,
        tranType: tranType!,
        amount,
        recipient_amount: recipientAmount,
      };
      if (isDonation) {
        body.is_donation = true;
      }
      return getExchangeRate(body);
    },
    enabled,
    // Keep previous data while a new rate loads to avoid flickering
    placeholderData: (prev) => prev,
    staleTime: 30_000, // 30 s – rates update frequently
    gcTime: 60_000,
    retry: (failureCount, error) => {
      if ("status" in error && typeof (error as any).status === "number") {
        if ((error as any).status >= 400 && (error as any).status < 500) return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}
