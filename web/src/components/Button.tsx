import { cn } from "@/utils/cn";

import { BUTTON_BASE, BUTTON_SIZES, BUTTON_VARIANTS, FOCUS_RING } from "./controlStyles";

type ButtonProps = {
  label: string;
  type: "submit" | "button";
  variant: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  isFullWidth: boolean;
  isDisabled: boolean;
  isBusy: boolean;
  onClick?: () => void;
};

export const Button = ({
  label,
  type,
  variant,
  size = "default",
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
      BUTTON_BASE,
      BUTTON_SIZES[size],
      BUTTON_VARIANTS[variant],
      isFullWidth ? "w-full" : "w-full md:w-auto",
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
    )}
  >
    {label}
  </button>
);
