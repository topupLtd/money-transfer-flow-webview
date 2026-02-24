import { api } from "../client";
import type { ExchangeRateBody, ExchangeRateResponse } from "../types/exchange-rate";

const EXCHANGE_RATE_ENDPOINT = "/exchange-rate";

/**
 * Fetches the exchange rate from POST /v2/exchange-rate.
 *
 * Mirrors the React Native `fetchExchangeRate` Redux action in
 * `paycell_0_81/src/store/actions/transfers.js`.
 *
 * The API uses v2; the version override is passed via `apiVersion`.
 */
export async function getExchangeRate(
  body: ExchangeRateBody,
): Promise<ExchangeRateResponse> {
  const raw = await api.post<ExchangeRateResponse>(EXCHANGE_RATE_ENDPOINT, body, {
    apiVersion: "v2",
  });
  return raw;
}
