export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const ACTION_PILL =
  "rounded-pill border-border text-accent hover:bg-hover-tint text-ui min-h-touch inline-flex items-center border px-3.5 py-2 transition-colors duration-120 md:min-h-9";

export const BUTTON_BASE = "px-btn-px text-ui rounded-md transition-colors duration-120";

export const BUTTON_VARIANTS = {
  primary:
    "bg-accent text-on-accent shadow-e1 hover:bg-accent-hover hover:shadow-e2 active:bg-accent-hover active:shadow-e1 font-medium",
  secondary: "border-border text-text hover:bg-hover-tint border",
  danger:
    "bg-blocked-fg text-on-accent shadow-e1 hover:shadow-e2 active:shadow-e1 font-medium",
} as const;

export const BUTTON_SIZES = {
  default: "h-btn-h",
  touch: "min-h-touch",
} as const;
