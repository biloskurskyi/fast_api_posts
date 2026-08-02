import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type BannerProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const Banner = ({ message, actionLabel, onAction }: BannerProps) => (
  <div className="bg-blocked-bg border-blocked-border text-blocked-fg shadow-e1 text-ui flex items-center justify-between gap-4 rounded-md border p-3">
    <p>{message}</p>
    {actionLabel !== undefined && onAction !== undefined ? (
      <button
        type="button"
        onClick={onAction}
        className={cn("shrink-0 rounded-md font-medium underline", FOCUS_RING)}
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);
