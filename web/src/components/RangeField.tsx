import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type RangeFieldProps = {
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabel: string;
  onValueChange: (value: number) => void;
};

export const RangeField = ({
  id,
  value,
  min,
  max,
  step,
  valueLabel,
  onValueChange,
}: RangeFieldProps) => (
  <input
    id={id}
    type="range"
    value={value}
    min={min}
    max={max}
    step={step}
    aria-valuetext={valueLabel}
    onChange={(event) => {
      onValueChange(Number(event.target.value));
    }}
    className={cn(
      "accent-accent min-h-touch w-full rounded-md",
      "disabled:pointer-events-none",
      FOCUS_RING,
    )}
  />
);
