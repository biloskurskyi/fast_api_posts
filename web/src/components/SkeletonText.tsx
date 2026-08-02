type SkeletonTextProps = {
  lineCount: number;
};

export const SkeletonText = ({ lineCount }: SkeletonTextProps) => (
  <div aria-hidden className="flex flex-col gap-3">
    {Array.from({ length: lineCount }, (_, line) => (
      <span key={line} className="bg-border animate-skeleton block h-3 rounded-sm" />
    ))}
  </div>
);
