const DEFAULT_API_ORIGIN = "http://127.0.0.1:8000";

export const env = {
  apiOrigin: process.env.API_ORIGIN ?? DEFAULT_API_ORIGIN,
} as const;
