import type { BACKEND_ERROR_CODES, CLIENT_ERROR_CODES } from "./errorCodes";

export type ApiErrorCode =
  | (typeof BACKEND_ERROR_CODES)[number]
  | (typeof CLIENT_ERROR_CODES)[number];

export type ApiError = {
  code: ApiErrorCode;
  status: number;
  fieldErrors: Record<string, string> | null;
  formError: string | null;
};
