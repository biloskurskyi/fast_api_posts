import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  value: string;
  options: readonly SelectOption[];
  onSelect: (value: string) => void;
};

export const SelectField = ({ id, value, options, onSelect }: SelectFieldProps) => (
  <select
    id={id}
    value={value}
    onChange={(event) => {
      onSelect(event.target.value);
    }}
    className={cn(
      "bg-page text-text text-ui border-border min-h-touch rounded-md border px-3 transition-colors duration-120",
      FOCUS_RING,
    )}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
