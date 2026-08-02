import { cn } from "@/utils/cn";

export type StatusTone = "ok" | "down" | "unknown";

const TONE_BACKGROUND: Record<StatusTone, string> = {
  ok: "bg-status-ok",
  down: "bg-status-down",
  unknown: "bg-border",
};

type StatusDotProps = {
  tone: StatusTone;
};

export const StatusDot = ({ tone }: StatusDotProps) => (
  <span
    aria-hidden
    className={cn(
      "rounded-pill size-2 shrink-0 transition-colors duration-120",
      TONE_BACKGROUND[tone],
    )}
  />
);
