import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type TextAreaProps = {
  id: string;
  rows: number;
  placeholder?: string;
  isInvalid: boolean;
  registration: UseFormRegisterReturn;
};

export const TextArea = ({
  id,
  rows,
  placeholder,
  isInvalid,
  registration,
}: TextAreaProps) => (
  <textarea
    id={id}
    rows={rows}
    placeholder={placeholder}
    aria-invalid={isInvalid}
    aria-describedby={`${id}-message`}
    className={cn(
      "bg-page text-text text-prose placeholder:text-secondary w-full resize-y rounded-md border px-3 py-2 font-serif transition-colors duration-120",
      "disabled:pointer-events-none",
      FOCUS_RING,
      isInvalid ? "border-blocked-border" : "border-border",
    )}
    {...registration}
  />
);
