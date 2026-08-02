import { cn } from "@/utils/cn";

const BAR_WIDTHS = [
  "w-0",
  "w-1/12",
  "w-2/12",
  "w-3/12",
  "w-4/12",
  "w-5/12",
  "w-6/12",
  "w-7/12",
  "w-8/12",
  "w-9/12",
  "w-10/12",
  "w-11/12",
  "w-full",
] as const;

const BAR_STEPS = BAR_WIDTHS.length - 1;

const toBarWidth = (value: number, max: number): string => {
  if (value === 0 || max === 0) return "w-0";
  const step = Math.max(1, Math.round((value / max) * BAR_STEPS));
  return BAR_WIDTHS[step] ?? "w-full";
};

type StatisticBarsProps = {
  total: number;
  blocked: number;
  max: number;
};

export const StatisticBars = ({ total, blocked, max }: StatisticBarsProps) => (
  <div aria-hidden className="flex flex-col gap-1">
    <span className={cn("bg-accent block h-2 rounded-sm", toBarWidth(total, max))} />
    <span className={cn("bg-blocked-fg block h-2 rounded-sm", toBarWidth(blocked, max))} />
  </div>
);
