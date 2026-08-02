import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

const VARIANT_STYLES = {
  default: "text-input",
  title: "text-title font-serif",
} as const;

type TextFieldProps = {
  id: string;
  type: "text" | "password";
  variant?: keyof typeof VARIANT_STYLES;
  autoComplete: string;
  placeholder?: string;
  isInvalid: boolean;
  isDisabled: boolean;
  registration: UseFormRegisterReturn;
};

export const TextField = ({
  id,
  type,
  variant = "default",
  autoComplete,
  placeholder,
  isInvalid,
  isDisabled,
  registration,
}: TextFieldProps) => (
  <input
    id={id}
    type={type}
    autoComplete={autoComplete}
    placeholder={placeholder}
    disabled={isDisabled}
    aria-invalid={isInvalid}
    aria-describedby={`${id}-message`}
    className={cn(
      "bg-page text-text placeholder:text-secondary min-h-touch w-full rounded-md border px-3 transition-colors duration-120",
      VARIANT_STYLES[variant],
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
      isInvalid ? "border-blocked-border" : "border-border",
    )}
    {...registration}
  />
);
