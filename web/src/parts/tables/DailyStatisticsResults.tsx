"use client";

import { useTranslation } from "react-i18next";

import { SkeletonText } from "@/components/SkeletonText";
import { Surface } from "@/components/Surface";
import { EmptyPanel } from "@/parts/feedback/EmptyPanel";
import type { DailyStatistics } from "@/types/statistics";

import { DailyStatisticsCardList } from "./DailyStatisticsCardList";
import { DailyStatisticsTable } from "./DailyStatisticsTable";
import { StatisticsLegend } from "./StatisticsLegend";

type DailyStatisticsResultsProps = {
  statistics: DailyStatistics | null;
  isLoading: boolean;
};

export const DailyStatisticsResults = ({
  statistics,
  isLoading,
}: DailyStatisticsResultsProps) => {
  const { t } = useTranslation("statistics");

  if (isLoading) {
    return (
      <Surface>
        <SkeletonText lineCount={6} />
      </Surface>
    );
  }

  if (statistics === null) return null;

  const { days, summary, maxTotal } = statistics;

  if (summary.totalComments === 0) {
    return <EmptyPanel title={t("empty.title")} description={t("empty.description")} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <StatisticsLegend />
      <div className="hidden md:block">
        <Surface>
          <DailyStatisticsTable days={days} maxTotal={maxTotal} />
        </Surface>
      </div>
      <div className="md:hidden">
        <DailyStatisticsCardList days={days} maxTotal={maxTotal} />
      </div>
      <p className="text-secondary text-meta">
        {t("grandTotal", {
          comments: summary.totalComments,
          days: summary.dayCount,
          blocked: summary.blockedComments,
        })}
      </p>
    </div>
  );
};
