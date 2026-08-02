import { cn } from "@/utils/cn";

type CharacterCounterProps = {
  label: string;
  isOverLimit: boolean;
};

export const CharacterCounter = ({ label, isOverLimit }: CharacterCounterProps) => (
  <p
    className={cn(
      "text-meta text-right",
      isOverLimit ? "text-blocked-fg" : "text-secondary",
    )}
  >
    {label}
  </p>
);
