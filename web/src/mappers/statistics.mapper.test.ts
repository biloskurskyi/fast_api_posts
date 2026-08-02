import { describe, expect, it } from "vitest";

import type { DailyStatDto } from "@/types/statistics";

import { toDailyCommentsRequest, toDailyStatistics } from "./statistics.mapper";

const range = { dateFrom: "2026-07-27", dateTo: "2026-08-01" };

const stat = (date: string, total: number, blocked: number): DailyStatDto => ({
  date,
  total_comments: total,
  blocked_comments: blocked,
});

describe("toDailyCommentsRequest", () => {
  it("renames the range onto the query parameters the API expects", () => {
    expect(toDailyCommentsRequest(range)).toEqual({
      date_from: "2026-07-27",
      date_to: "2026-08-01",
    });
  });
});

describe("toDailyStatistics", () => {
  it("returns one row per calendar day, not per reported day", () => {
    const { days } = toDailyStatistics([stat("2026-07-29", 4, 1)], range);

    expect(days.map((day) => day.date)).toEqual([
      "2026-07-27",
      "2026-07-28",
      "2026-07-29",
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
    ]);
  });

  it("zero-fills the days the API omitted", () => {
    const { days } = toDailyStatistics([stat("2026-07-29", 4, 1)], range);

    expect(days[0]).toEqual({
      date: "2026-07-27",
      label: "Mon, Jul 27",
      total: 0,
      blocked: 0,
    });
    expect(days[2]).toEqual({
      date: "2026-07-29",
      label: "Wed, Jul 29",
      total: 4,
      blocked: 1,
    });
  });

  it("keeps the axis in ascending order whatever order the rows arrive in", () => {
    const { days } = toDailyStatistics(
      [stat("2026-08-01", 2, 0), stat("2026-07-27", 5, 2)],
      range,
    );

    expect(days.map((day) => day.total)).toEqual([5, 0, 0, 0, 0, 2]);
  });

  it("sums every day into the grand total", () => {
    const { summary } = toDailyStatistics(
      [stat("2026-07-27", 5, 2), stat("2026-08-01", 3, 1)],
      range,
    );

    expect(summary).toEqual({ totalComments: 8, blockedComments: 3, dayCount: 6 });
  });

  it("treats an empty response as a fully zero range rather than no range", () => {
    const { days, summary, maxTotal } = toDailyStatistics([], range);

    expect(days).toHaveLength(6);
    expect(summary).toEqual({ totalComments: 0, blockedComments: 0, dayCount: 6 });
    expect(maxTotal).toBe(0);
  });

  it("scales the bars against the busiest day", () => {
    const { maxTotal } = toDailyStatistics(
      [stat("2026-07-27", 5, 0), stat("2026-07-30", 12, 3)],
      range,
    );

    expect(maxTotal).toBe(12);
  });

  it("handles a single-day range inclusively at both ends", () => {
    const { days, summary } = toDailyStatistics([stat("2026-07-27", 1, 0)], {
      dateFrom: "2026-07-27",
      dateTo: "2026-07-27",
    });

    expect(days).toHaveLength(1);
    expect(summary.dayCount).toBe(1);
  });

  it("spans a month boundary without dropping or duplicating a day", () => {
    const { days } = toDailyStatistics([], {
      dateFrom: "2026-01-30",
      dateTo: "2026-02-02",
    });

    expect(days.map((day) => day.date)).toEqual([
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
    ]);
  });

  it("ignores rows the API returned outside the requested range", () => {
    const { summary } = toDailyStatistics([stat("2026-06-01", 99, 99)], range);

    expect(summary.totalComments).toBe(0);
  });
});
