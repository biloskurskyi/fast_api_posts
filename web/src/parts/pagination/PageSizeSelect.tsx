"use client";

import { useTranslation } from "react-i18next";

import { FieldLabel } from "@/components/FieldLabel";
import { SelectField } from "@/components/SelectField";
import { FEED_PAGE_SIZES } from "@/constants/pagination";

const PAGE_SIZE_SELECT_ID = "feed-page-size";

const PAGE_SIZE_OPTIONS = FEED_PAGE_SIZES.map((size) => ({
  value: String(size),
  label: String(size),
}));

type PageSizeSelectProps = {
  pageSize: number;
  onSelect: (pageSize: number) => void;
};

export const PageSizeSelect = ({ pageSize, onSelect }: PageSizeSelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <FieldLabel htmlFor={PAGE_SIZE_SELECT_ID} label={t("pagination.pageSize")} />
      <SelectField
        id={PAGE_SIZE_SELECT_ID}
        value={String(pageSize)}
        options={PAGE_SIZE_OPTIONS}
        onSelect={(value) => {
          onSelect(Number(value));
        }}
      />
    </div>
  );
};
