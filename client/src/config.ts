/**
 * Application configuration
 * Centralized config values used across the app
 */

export const config = {
  /** Base URL for the Paycell API */
  apiBaseUrl: "https://paycell-test.paytop.com/api",

  /** Default API version */
  defaultApiVersion: "v1" as const,

  /** Request timeout in milliseconds */
  requestTimeout: 30_000,

  /** Whether the app is in development mode */
  isDev: import.meta.env.DEV,
} as const;
