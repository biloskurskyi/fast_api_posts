"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";

import { PageSizeSelect } from "./PageSizeSelect";

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSelectPageSize: (pageSize: number) => void;
};

export const PaginationControls = ({
  page,
  pageSize,
  hasPrevious,
  hasNext,
  onPreviousPage,
  onNextPage,
  onSelectPageSize,
}: PaginationControlsProps) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("pagination.ariaLabel")}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <PageSizeSelect pageSize={pageSize} onSelect={onSelectPageSize} />
      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        <span className="text-secondary text-meta">{t("pagination.page", { page })}</span>
        <Button
          label={t("pagination.previous")}
          type="button"
          variant="secondary"
          isFullWidth={false}
          isDisabled={!hasPrevious}
          isBusy={false}
          onClick={onPreviousPage}
        />
        <Button
          label={t("pagination.next")}
          type="button"
          variant="secondary"
          isFullWidth={false}
          isDisabled={!hasNext}
          isBusy={false}
          onClick={onNextPage}
        />
      </div>
    </nav>
  );
};
