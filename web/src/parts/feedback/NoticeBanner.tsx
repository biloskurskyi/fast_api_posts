"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Banner } from "@/components/Banner";
import { NOTICE_MESSAGE_KEYS, NOTICE_PARAM } from "@/constants/notices";

export const NoticeBanner = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const notice = searchParams.get(NOTICE_PARAM);
  const messageKey = notice === null ? undefined : NOTICE_MESSAGE_KEYS[notice];
  if (messageKey === undefined) return null;

  const dismissNotice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(NOTICE_PARAM);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="px-gutter max-w-banner mx-auto w-full pt-4">
      <Banner
        message={t(messageKey)}
        actionLabel={t("actions.dismiss")}
        onAction={dismissNotice}
      />
    </div>
  );
};
