import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type ButtonProps = {
  label: string;
  isDisabled: boolean;
  isBusy: boolean;
};

export const Button = ({ label, isDisabled, isBusy }: ButtonProps) => (
  <button
    type="submit"
    disabled={isDisabled}
    aria-busy={isBusy}
    className={cn(
      "bg-accent text-on-accent shadow-e1 hover:bg-accent-hover hover:shadow-e2 active:shadow-e1 h-btn-h px-btn-px text-ui w-full rounded-md font-medium transition-colors duration-120",
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
    )}
  >
    {label}
  </button>
);
