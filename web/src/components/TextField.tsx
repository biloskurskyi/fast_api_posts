import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type TextFieldProps = {
  id: string;
  type: "text" | "password";
  autoComplete: string;
  placeholder?: string;
  isInvalid: boolean;
  isDisabled: boolean;
  registration: UseFormRegisterReturn;
};

export const TextField = ({
  id,
  type,
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
      "bg-page text-text text-input placeholder:text-secondary min-h-touch w-full rounded-md border px-3 transition-colors duration-120",
      "disabled:pointer-events-none disabled:opacity-45",
      FOCUS_RING,
      isInvalid ? "border-blocked-border" : "border-border",
    )}
    {...registration}
  />
);
