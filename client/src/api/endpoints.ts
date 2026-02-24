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

  /** Source of funds list (⚠️ SHUFFLED: swapped with transfer-reasons due to API response mismatch — swap back later) */
  ORIGIN_OF_FUNDS: "/transfer-reasons",

  /** Transfer reasons list (⚠️ SHUFFLED: swapped with origin-of-funds due to API response mismatch — swap back later) */
  TRANSFER_REASONS: "/origin-of-funds",

  /** Update transaction reason & source of funds */
  UPDATE_REASON_SOURCE: "/transaction/reason-source",

  /** Parent recipients list (recipients grouped by parent) */
  PARENT_RECIPIENTS: "/recipient/parents",
} as const;
