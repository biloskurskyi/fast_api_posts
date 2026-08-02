import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type TabItem<TValue extends string> = {
  value: TValue;
  label: string;
};

type TabsProps<TValue extends string> = {
  ariaLabel: string;
  value: TValue;
  items: readonly TabItem<TValue>[];
  onSelect: (value: TValue) => void;
};

export const Tabs = <TValue extends string>({
  ariaLabel,
  value,
  items,
  onSelect,
}: TabsProps<TValue>) => (
  <div role="group" aria-label={ariaLabel} className="flex items-center gap-2">
    {items.map((item) => (
      <button
        key={item.value}
        type="button"
        aria-pressed={item.value === value}
        onClick={() => onSelect(item.value)}
        className={cn(
          "rounded-pill min-h-touch text-ui inline-flex flex-1 items-center justify-center px-4 font-medium transition-colors duration-120",
          FOCUS_RING,
          item.value === value
            ? "bg-accent text-on-accent"
            : "text-secondary hover:bg-hover-tint",
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);
