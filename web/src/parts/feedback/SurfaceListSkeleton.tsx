import { SkeletonText } from "@/components/SkeletonText";
import { Surface } from "@/components/Surface";

type SurfaceListSkeletonProps = {
  cardCount: number;
  lineCount: number;
};

export const SurfaceListSkeleton = ({
  cardCount,
  lineCount,
}: SurfaceListSkeletonProps) => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: cardCount }, (_, card) => (
      <Surface key={card}>
        <SkeletonText lineCount={lineCount} />
      </Surface>
    ))}
  </div>
);
