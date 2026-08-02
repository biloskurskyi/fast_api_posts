import { cn } from "@/utils/cn";

import { ACTION_PILL, FOCUS_RING } from "./controlStyles";

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
      ACTION_PILL,
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
    )}
  >
    {label}
  </button>
);
