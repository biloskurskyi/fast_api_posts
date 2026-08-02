import { z } from "zod";

import type { ApiError, ApiErrorCode } from "./apiError.types";
import { BACKEND_ERROR_CODES } from "./errorCodes";

const NETWORK_ERROR_STATUS = 0;

const errorEnvelopeSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

const backendErrorCodes: readonly string[] = BACKEND_ERROR_CODES;

const isBackendErrorCode = (code: string): code is ApiErrorCode =>
  backendErrorCodes.includes(code);

export const toApiError = (
  status: number | undefined,
  payload: unknown,
): ApiError => {
  if (status === undefined) {
    return {
      code: "network_error",
      status: NETWORK_ERROR_STATUS,
      fieldErrors: null,
      formError: null,
    };
  }

  const envelope = errorEnvelopeSchema.safeParse(payload);
  const code =
    envelope.success && isBackendErrorCode(envelope.data.error.code)
      ? envelope.data.error.code
      : "unknown_error";

  return { code, status, fieldErrors: null, formError: null };
};
