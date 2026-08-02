export const BACKEND_ERROR_CODES = [
  "validation_error",
  "not_authenticated",
  "invalid_token",
  "inactive_user",
  "invalid_credentials",
  "username_taken",
  "forbidden",
  "post_not_found",
  "comment_not_found",
  "payload_too_large",
  "internal_error",
  "not_found",
  "method_not_allowed",
] as const;

export const CLIENT_ERROR_CODES = ["network_error", "unknown_error"] as const;

export const SESSION_ENDING_ERROR_CODES = [
  "not_authenticated",
  "invalid_token",
  "inactive_user",
] as const;
