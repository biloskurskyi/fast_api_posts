import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

const ISO_DATE_PATTERN = "yyyy-MM-dd";

const toIsoDate = (date: Date): string => format(date, ISO_DATE_PATTERN);

export const utcToday = (): string => new Date().toISOString().slice(0, 10);

export const countRangeDays = (dateFrom: string, dateTo: string): number =>
  differenceInCalendarDays(parseISO(dateTo), parseISO(dateFrom)) + 1;

export const enumerateDays = (dateFrom: string, dateTo: string): string[] => {
  const start = parseISO(dateFrom);
  return Array.from({ length: countRangeDays(dateFrom, dateTo) }, (_, offset) =>
    toIsoDate(addDays(start, offset)),
  );
};
