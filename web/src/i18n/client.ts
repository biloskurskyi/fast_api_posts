"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { i18nConfig } from "./config";

if (!i18next.isInitialized) {
  void i18next
    .use(initReactI18next)
    .init({ ...i18nConfig, react: { useSuspense: false } });
}

export const i18nClient = i18next;
