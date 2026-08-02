import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type DateFieldProps = {
  id: string;
  latestDate: string;
  isInvalid: boolean;
  registration: UseFormRegisterReturn;
};

export const DateField = ({ id, latestDate, isInvalid, registration }: DateFieldProps) => (
  <input
    id={id}
    type="date"
    max={latestDate}
    aria-invalid={isInvalid}
    aria-describedby={`${id}-message`}
    className={cn(
      "bg-page text-text text-ui min-h-touch w-full rounded-md border px-3 transition-colors duration-120",
      FOCUS_RING,
      isInvalid ? "border-blocked-border" : "border-border",
    )}
    {...registration}
  />
);
