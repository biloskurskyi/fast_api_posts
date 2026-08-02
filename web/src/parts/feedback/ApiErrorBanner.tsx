"use client";

import { Banner } from "@/components/Banner";
import type { ApiError } from "@/errors/apiError.types";
import { useErrorMessage } from "@/errors/useErrorMessage";

type ApiErrorBannerProps = {
  error: ApiError | null;
};

export const ApiErrorBanner = ({ error }: ApiErrorBannerProps) => {
  const message = useErrorMessage(error);
  if (message === null) return null;

  return <Banner message={message} />;
};
