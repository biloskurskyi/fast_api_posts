import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type ActionPillProps = {
  label: string;
  isDisabled: boolean;
  onClick: () => void;
};

export const ActionPill = ({ label, isDisabled, onClick }: ActionPillProps) => (
  <button
    type="button"
    disabled={isDisabled}
    onClick={onClick}
    className={cn(
      "rounded-pill border-border text-accent hover:bg-hover-tint text-ui inline-flex min-h-9 items-center border px-3.5 py-2 transition-colors duration-120",
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
    )}
  >
    {label}
  </button>
);
