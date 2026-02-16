/**
 * API Client
 * Centralized Axios instance with versioning, auth, error handling, and logging
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { config } from "@/config";
import { type ApiVersion, getVersionPath } from "./version";

/**
 * Normalized API error shape returned to consumers
 */
export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

/**
 * Extended request config that supports per-request version override
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  /** Override the default API version for this request */
  apiVersion?: ApiVersion;
}

// Custom property on Axios config to carry version override
declare module "axios" {
  interface InternalAxiosRequestConfig {
    apiVersion?: ApiVersion;
  }
}

/**
 * Creates and configures the Axios instance
 */
function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: config.requestTimeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // ── Request interceptor ──────────────────────────────────────────
  instance.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
      // Prepend version path
      const version = reqConfig.apiVersion ?? config.defaultApiVersion;
      const versionPath = getVersionPath(version);
      reqConfig.url = `${versionPath}${reqConfig.url ?? ""}`;

      // Attach authorization token if available
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;
      if (token) {
        reqConfig.headers.set("Authorization", `Bearer ${token}`);
      }

      // Dev logging
      if (config.isDev) {
        console.log(
          `[API] ${reqConfig.method?.toUpperCase()} ${config.apiBaseUrl}${reqConfig.url}`,
        );
      }

      return reqConfig;
    },
    (error) => Promise.reject(error),
  );

  // ── Response interceptor ─────────────────────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const normalized: ApiError = {
        status: error.response?.status ?? 0,
        message:
          (error.response?.data as { message?: string })?.message ??
          error.message ??
          "An unexpected error occurred",
        data: error.response?.data,
      };

      if (config.isDev) {
        console.error("[API Error]", normalized);
      }

      return Promise.reject(normalized);
    },
  );

  return instance;
}

/** Singleton API client instance */
export const apiClient = createApiClient();

/**
 * Convenience helpers that support per-request version overrides
 */
export const api = {
  get: <T>(url: string, cfg?: ApiRequestConfig) =>
    apiClient.get<T>(url, cfg).then((r) => r.data),

  post: <T>(url: string, data?: unknown, cfg?: ApiRequestConfig) =>
    apiClient.post<T>(url, data, cfg).then((r) => r.data),

  put: <T>(url: string, data?: unknown, cfg?: ApiRequestConfig) =>
    apiClient.put<T>(url, data, cfg).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, cfg?: ApiRequestConfig) =>
    apiClient.patch<T>(url, data, cfg).then((r) => r.data),

  delete: <T>(url: string, cfg?: ApiRequestConfig) =>
    apiClient.delete<T>(url, cfg).then((r) => r.data),
} as const;
