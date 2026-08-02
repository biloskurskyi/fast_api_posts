import { createInstance, type TFunction } from "i18next";

import { FALLBACK_LANGUAGE, i18nConfig } from "./config";

export const getT = async (namespace: "common"): Promise<TFunction> => {
  const instance = createInstance();
  await instance.init(i18nConfig);
  return instance.getFixedT(FALLBACK_LANGUAGE, namespace);
};
