export type DailyStatDto = {
  date: string;
  total_comments: number;
  blocked_comments: number;
};

export type DailyCommentsRequest = {
  date_from: string;
  date_to: string;
};

export type StatisticsRange = {
  dateFrom: string;
  dateTo: string;
};

export type DailyStat = {
  date: string;
  label: string;
  total: number;
  blocked: number;
};

export type StatisticsSummary = {
  totalComments: number;
  blockedComments: number;
  dayCount: number;
};

export type DailyStatistics = {
  days: DailyStat[];
  summary: StatisticsSummary;
  maxTotal: number;
};
