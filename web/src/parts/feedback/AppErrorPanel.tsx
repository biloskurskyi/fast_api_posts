"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { TextLink } from "@/components/TextLink";
import { ROUTES } from "@/constants/routes";

import { EmptyPanel } from "./EmptyPanel";

type AppErrorPanelProps = {
  onRetry: () => void;
};

export const AppErrorPanel = ({ onRetry }: AppErrorPanelProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-gutter pt-16 pb-24">
      <div className="max-w-feed mx-auto">
        <EmptyPanel
          title={t("boundary.error.title")}
          description={t("boundary.error.description")}
          action={
            <div className="flex w-full flex-col items-center gap-3">
              <Button
                label={t("actions.retry")}
                type="button"
                variant="primary"
                isFullWidth={false}
                isDisabled={false}
                isBusy={false}
                onClick={onRetry}
              />
              <TextLink href={ROUTES.feed} label={t("boundary.backToFeed")} />
            </div>
          }
        />
      </div>
    </div>
  );
};
