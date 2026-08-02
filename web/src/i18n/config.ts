import common from "./locales/en/common.json";

export const FALLBACK_LANGUAGE = "en";

export const resources = {
  en: { common },
} as const;

export const i18nConfig = {
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: "common",
  ns: ["common"],
  resources,
  interpolation: { escapeValue: false },
} as const;
