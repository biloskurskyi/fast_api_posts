import { SkeletonText } from "@/components/SkeletonText";
import { Surface } from "@/components/Surface";

const SKELETON_LINE_COUNT = 6;

export const PostDetailSkeleton = () => (
  <Surface padding="wide">
    <SkeletonText lineCount={SKELETON_LINE_COUNT} />
  </Surface>
);
