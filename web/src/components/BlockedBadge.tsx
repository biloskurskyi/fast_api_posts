type BlockedBadgeProps = {
  label: string;
};

export const BlockedBadge = ({ label }: BlockedBadgeProps) => (
  <span className="rounded-pill border-blocked-border text-blocked-fg text-meta border px-2.5 py-1">
    {label}
  </span>
);
