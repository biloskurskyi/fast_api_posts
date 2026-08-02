import auth from "./locales/en/auth.json";
import common from "./locales/en/common.json";
import errors from "./locales/en/errors.json";
import validation from "./locales/en/validation.json";

export const FALLBACK_LANGUAGE = "en";

export const resources = {
  en: { common, auth, errors, validation },
} as const;

export type TranslationNamespace = keyof (typeof resources)["en"];

export const i18nConfig = {
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: "common",
  ns: ["common", "auth", "errors", "validation"],
  resources,
  interpolation: { escapeValue: false },
} as const;
