import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

const PADDING_STYLES = {
  default: "px-6 py-16",
  compact: "px-6 py-12",
} as const;

type EmptyPanelProps = {
  title: string;
  description?: string;
  padding?: keyof typeof PADDING_STYLES;
  action?: ReactNode;
};

export const EmptyPanel = ({
  title,
  description,
  padding = "default",
  action,
}: EmptyPanelProps) => (
  <div
    className={cn(
      "bg-raised shadow-e1 flex flex-col items-center gap-3 rounded-lg text-center",
      PADDING_STYLES[padding],
    )}
  >
    <p className="text-text text-title font-serif font-semibold">{title}</p>
    {description === undefined ? null : (
      <p className="text-secondary text-prose max-w-prose font-serif text-pretty">
        {description}
      </p>
    )}
    {action}
  </div>
);
