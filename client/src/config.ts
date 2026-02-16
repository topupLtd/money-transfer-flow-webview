/**
 * Application configuration
 * Centralized config values used across the app
 */

export const config = {
  /** Base URL for the Paycell API */
  apiBaseUrl: "https://paycell-test.paytop.com/api",

  /** Base URL for storage assets (flags, images, etc.) */
  storageBaseUrl: "https://paycell-test.paytop.com/storage",

  /** Default API version */
  defaultApiVersion: "v1" as const,

  /** Request timeout in milliseconds */
  requestTimeout: 30_000,

  /** Default sender country code */
  FROM_COUNTRY_CODE: "FR",

  /** Default selected destination country code */
  SELECTED_TO_COUNTRY_CODE: "TR",

  /** Whether the app is in development mode */
  isDev: import.meta.env.DEV,
} as const;
