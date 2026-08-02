"use client";

import { useTranslation } from "react-i18next";

import { Banner } from "@/components/Banner";
import type { ApiError } from "@/errors/apiError.types";
import { UNMATCHED_ROUTE_ERROR_CODE } from "@/errors/errorCodes";
import { useErrorMessage } from "@/errors/useErrorMessage";

type ApiErrorBannerProps = {
  error: ApiError | null;
  onRetry?: () => void;
};

export const ApiErrorBanner = ({ error, onRetry }: ApiErrorBannerProps) => {
  const { t } = useTranslation();
  const message = useErrorMessage(error);

  if (error?.code === UNMATCHED_ROUTE_ERROR_CODE) throw new Error(error.code);
  if (message === null) return null;

  return (
    <Banner
      message={message}
      actionLabel={onRetry === undefined ? undefined : t("actions.retry")}
      onAction={onRetry}
    />
  );
};
