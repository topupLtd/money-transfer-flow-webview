/**
 * API endpoint constants
 * Single source of truth for all API endpoint paths
 */

export const ENDPOINTS = {
  /** Currency & country list */
  CURRENCY_COUNTRIES: "/currency-countries",

  /** Available pickup methods & transfer times */
  AVAILABLE_PICKUP_METHOD_TRANSFER_TIME: "/available-pickup-method-transfer-time",

  /** Exchange rate (v2) */
  EXCHANGE_RATE: "/exchange-rate",

  /** Transaction quote */
  TRANSACTION_QUOTE: "/quote-user",

  /** Create transaction */
  CREATE_TRANSACTION: "/transaction",

  /** Recipients list */
  RECIPIENTS: "/recipients",

  /** Update transaction (PATCH) — associate recipient with quote */
  UPDATE_TRANSACTION: "/transaction",
} as const;
