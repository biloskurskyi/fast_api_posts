"use client";

import { useTranslation } from "react-i18next";

import { StatisticBars } from "@/components/StatisticBars";
import { Surface } from "@/components/Surface";
import type { DailyStat } from "@/types/statistics";

type DailyStatisticsCardListProps = {
  days: DailyStat[];
  maxTotal: number;
};

export const DailyStatisticsCardList = ({
  days,
  maxTotal,
}: DailyStatisticsCardListProps) => {
  const { t } = useTranslation("statistics");

  return (
    <ul className="flex flex-col gap-3">
      {days.map((day) => (
        <li key={day.date}>
          <Surface>
            <div className="flex flex-col gap-2">
              <p className="text-text text-meta font-medium">{day.label}</p>
              <StatisticBars total={day.total} blocked={day.blocked} max={maxTotal} />
              <p className="text-secondary text-meta">
                {t("row.counts", { total: day.total, blocked: day.blocked })}
              </p>
            </div>
          </Surface>
        </li>
      ))}
    </ul>
  );
};
