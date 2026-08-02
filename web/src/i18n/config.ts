import auth from "./locales/en/auth.json";
import common from "./locales/en/common.json";
import errors from "./locales/en/errors.json";
import feed from "./locales/en/feed.json";
import post from "./locales/en/post.json";
import settings from "./locales/en/settings.json";
import statistics from "./locales/en/statistics.json";
import validation from "./locales/en/validation.json";

export const FALLBACK_LANGUAGE = "en";

export const resources = {
  en: { common, auth, errors, feed, post, settings, statistics, validation },
} as const;

export type TranslationNamespace = keyof (typeof resources)["en"];

export const i18nConfig = {
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: "common",
  ns: [
    "common",
    "auth",
    "errors",
    "feed",
    "post",
    "settings",
    "statistics",
    "validation",
  ],
  resources,
  interpolation: { escapeValue: false },
} as const;
