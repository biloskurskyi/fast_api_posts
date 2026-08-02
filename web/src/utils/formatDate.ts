import { format, parseISO } from "date-fns";

const DAY_LABEL_PATTERN = "EEE, MMM d";
const TIMESTAMP_PATTERN = "MMM d, HH:mm";

export const formatDayLabel = (isoDate: string): string =>
  format(parseISO(isoDate), DAY_LABEL_PATTERN);

export const formatTimestamp = (isoTimestamp: string): string =>
  format(parseISO(isoTimestamp), TIMESTAMP_PATTERN);
