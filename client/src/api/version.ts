/**
 * API versioning utility
 * Handles constructing versioned API paths
 */

export type ApiVersion = "v1" | "v2" | "v3";

/**
 * Builds a versioned path segment.
 * @param version - API version to use (defaults handled by caller)
 * @returns The version path segment, e.g., "/v1"
 */
export function getVersionPath(version: ApiVersion): string {
  return `/${version}`;
}
