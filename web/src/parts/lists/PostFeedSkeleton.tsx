import { SkeletonText } from "@/components/SkeletonText";
import { Surface } from "@/components/Surface";

const SKELETON_CARD_COUNT = 4;
const SKELETON_LINE_COUNT = 4;

export const PostFeedSkeleton = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: SKELETON_CARD_COUNT }, (_, card) => (
      <Surface key={card}>
        <SkeletonText lineCount={SKELETON_LINE_COUNT} />
      </Surface>
    ))}
  </div>
);
