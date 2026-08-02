import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

const VARIANT_STYLES = {
  primary:
    "bg-accent text-on-accent shadow-e1 hover:bg-accent-hover hover:shadow-e2 active:shadow-e1 font-medium",
  secondary: "border-border text-text hover:bg-hover-tint border",
} as const;

type ButtonProps = {
  label: string;
  type: "submit" | "button";
  variant: keyof typeof VARIANT_STYLES;
  isFullWidth: boolean;
  isDisabled: boolean;
  isBusy: boolean;
  onClick?: () => void;
};

export const Button = ({
  label,
  type,
  variant,
  isFullWidth,
  isDisabled,
  isBusy,
  onClick,
}: ButtonProps) => (
  <button
    type={type}
    disabled={isDisabled}
    aria-busy={isBusy}
    onClick={onClick}
    className={cn(
      "h-btn-h px-btn-px text-ui rounded-md transition-colors duration-120",
      VARIANT_STYLES[variant],
      isFullWidth ? "w-full" : "w-full md:w-auto",
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
    )}
  >
    {label}
  </button>
);
