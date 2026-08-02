"use client";

import { useTranslation } from "react-i18next";

import { StatisticBars } from "@/components/StatisticBars";
import type { DailyStat } from "@/types/statistics";

type DailyStatisticsTableProps = {
  days: DailyStat[];
  maxTotal: number;
};

export const DailyStatisticsTable = ({ days, maxTotal }: DailyStatisticsTableProps) => {
  const { t } = useTranslation("statistics");

  return (
    <table className="w-full">
      <caption className="sr-only">{t("table.caption")}</caption>
      <thead>
        <tr>
          <th scope="col" className="sr-only">
            {t("table.columns.day")}
          </th>
          <th scope="col" className="sr-only">
            {t("table.columns.activity")}
          </th>
          <th scope="col" className="sr-only">
            {t("table.columns.counts")}
          </th>
        </tr>
      </thead>
      <tbody>
        {days.map((day) => (
          <tr key={day.date}>
            <th
              scope="row"
              className="text-secondary text-meta w-stat-label py-2 pr-4 text-left font-normal"
            >
              {day.label}
            </th>
            <td className="py-2">
              <StatisticBars total={day.total} blocked={day.blocked} max={maxTotal} />
            </td>
            <td className="text-secondary text-meta w-stat-number py-2 pl-4 text-right">
              {t("row.counts", { total: day.total, blocked: day.blocked })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
