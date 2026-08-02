"use client";

import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/useAuth";
import { Banner } from "@/components/Banner";

export const SessionExpiredToast = () => {
  const { t } = useTranslation("auth");
  const { hasSessionExpiredNotice, dismissSessionExpiredNotice } = useAuth();

  if (!hasSessionExpiredNotice) return null;

  return (
    <div
      role="status"
      className="px-gutter max-w-banner pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto pb-6"
    >
      <div className="pointer-events-auto">
        <Banner
          message={t("session.expired")}
          dismissLabel={t("session.dismiss")}
          onDismiss={dismissSessionExpiredNotice}
        />
      </div>
    </div>
  );
};
