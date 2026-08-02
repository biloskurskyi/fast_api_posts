import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type BannerProps = {
  message: string;
  dismissLabel?: string;
  onDismiss?: () => void;
};

export const Banner = ({ message, dismissLabel, onDismiss }: BannerProps) => (
  <div className="bg-blocked-bg border-blocked-border text-blocked-fg shadow-e1 text-ui flex items-center justify-between gap-4 rounded-md border p-3">
    <p>{message}</p>
    {dismissLabel !== undefined && onDismiss !== undefined ? (
      <button
        type="button"
        onClick={onDismiss}
        className={cn("shrink-0 rounded-md font-medium underline", FOCUS_RING)}
      >
        {dismissLabel}
      </button>
    ) : null}
  </div>
);
