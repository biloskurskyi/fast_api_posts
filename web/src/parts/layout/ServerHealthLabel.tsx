"use client";

import { useTranslation } from "react-i18next";

import { useHealthQueries } from "@/hooks/queries/useHealthQueries";

export const ServerHealthLabel = () => {
  const { t } = useTranslation();
  const { serverStatus } = useHealthQueries();

  if (serverStatus === "unknown") return null;

  return (
    <span className="text-secondary text-meta">
      {serverStatus === "ok" ? t("health.healthy") : t("health.unreachable")}
    </span>
  );
};
