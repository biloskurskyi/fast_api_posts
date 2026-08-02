"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import { getQueryClient } from "@/config/queryClient";
import { i18nClient } from "@/i18n/client";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => (
  <QueryClientProvider client={getQueryClient()}>
    <I18nextProvider i18n={i18nClient}>{children}</I18nextProvider>
  </QueryClientProvider>
);
