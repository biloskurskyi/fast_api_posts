import { z } from "zod";

import { parseValidationMessage } from "@/mappers/validationError.mapper";

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
  if (!envelope.success) {
    return { code: "unknown_error", status, fieldErrors: null, formError: null };
  }

  const { code, message } = envelope.data.error;
  if (!isBackendErrorCode(code)) {
    return { code: "unknown_error", status, fieldErrors: null, formError: null };
  }

  if (code !== "validation_error") {
    return { code, status, fieldErrors: null, formError: null };
  }

  return { code, status, ...parseValidationMessage(message) };
};
