/**
 * API endpoint constants
 * Single source of truth for all API endpoint paths
 */

export const ENDPOINTS = {
  /** Currency & country list */
  CURRENCY_COUNTRIES: "/currency-countries",

  /** Available pickup methods & transfer times */
  AVAILABLE_PICKUP_METHOD_TRANSFER_TIME: "/available-pickup-method-transfer-time",
} as const;
