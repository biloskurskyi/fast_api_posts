"use client";

import { useTranslation } from "react-i18next";

import type { ApiError } from "./apiError.types";

export const useErrorMessage = (error: ApiError | null): string | null => {
  const { t } = useTranslation("errors");
  if (error === null) return null;
  return t(error.formError ?? error.code);
};
