"use client";

import { useTranslation } from "react-i18next";

export const StatisticsLegend = () => {
  const { t } = useTranslation("statistics");

  return (
    <div className="text-secondary text-meta flex flex-wrap items-center gap-4">
      <span className="flex items-center gap-2">
        <span aria-hidden className="bg-accent block size-3 rounded-sm" />
        {t("legend.total")}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="bg-blocked-fg block size-3 rounded-sm" />
        {t("legend.blocked")}
      </span>
      <span>{t("legend.note")}</span>
    </div>
  );
};
