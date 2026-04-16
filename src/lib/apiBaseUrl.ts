/** Site origin for static assets / evidence URLs (no /api suffix). */
export const DEFAULT_API_ORIGIN = "https://firesafety-backend.fireguide.co.uk";

/** Default API root when `VITE_API_BASE_URL` is unset (must include `/api` if your backend uses that prefix). */
export const DEFAULT_API_BASE_URL = `${DEFAULT_API_ORIGIN}/api`;

export function resolveApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  return fromEnv || DEFAULT_API_BASE_URL;
}
