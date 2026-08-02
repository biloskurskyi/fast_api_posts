import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type PillButtonProps = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
};

export const PillButton = ({ label, ariaLabel, onClick }: PillButtonProps) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    className={cn(
      "rounded-pill text-ui border-border text-secondary hover:bg-hover-tint hover:text-text min-h-touch inline-flex items-center border px-4 transition-colors duration-120",
      FOCUS_RING,
    )}
  >
    {label}
  </button>
);
