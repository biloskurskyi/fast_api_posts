import { Switch } from "radix-ui";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type SwitchFieldProps = {
  id: string;
  label: string;
  isChecked: boolean;
  isDisabled: boolean;
  onCheckedChange: (isChecked: boolean) => void;
};

export const SwitchField = ({
  id,
  label,
  isChecked,
  isDisabled,
  onCheckedChange,
}: SwitchFieldProps) => (
  <div className="flex items-center justify-between gap-4">
    <label htmlFor={id} className="text-text text-meta font-medium">
      {label}
    </label>
    <Switch.Root
      id={id}
      checked={isChecked}
      disabled={isDisabled}
      onCheckedChange={onCheckedChange}
      className={cn(
        "rounded-pill flex h-7 w-12 shrink-0 items-center p-1 transition-colors duration-120",
        "disabled:pointer-events-none disabled:opacity-45",
        FOCUS_RING,
        isChecked ? "bg-accent" : "bg-border",
      )}
    >
      <Switch.Thumb
        className={cn(
          "rounded-pill bg-raised shadow-e1 block size-5 transition-transform duration-180",
          isChecked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </Switch.Root>
  </div>
);
