import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

const TONE_STYLES = {
  raised: "bg-raised border-transparent",
  blocked: "bg-blocked-bg border-blocked-border",
} as const;

const PADDING_STYLES = {
  default: "p-6",
  wide: "p-8",
} as const;

type SurfaceProps = {
  tone?: keyof typeof TONE_STYLES;
  padding?: keyof typeof PADDING_STYLES;
  children: ReactNode;
};

export const Surface = ({
  tone = "raised",
  padding = "default",
  children,
}: SurfaceProps) => (
  <div
    className={cn(
      "shadow-e1 rounded-lg border",
      TONE_STYLES[tone],
      PADDING_STYLES[padding],
    )}
  >
    {children}
  </div>
);
