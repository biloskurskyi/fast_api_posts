import { createInstance, type TFunction } from "i18next";

import { FALLBACK_LANGUAGE, i18nConfig, type TranslationNamespace } from "./config";

export const getT = async (namespace: TranslationNamespace): Promise<TFunction> => {
  const instance = createInstance();
  await instance.init(i18nConfig);
  return instance.getFixedT(FALLBACK_LANGUAGE, namespace);
};
