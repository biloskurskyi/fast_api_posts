import { SurfaceListSkeleton } from "@/parts/feedback/SurfaceListSkeleton";

const SKELETON_CARD_COUNT = 4;
const SKELETON_LINE_COUNT = 4;

export const PostFeedSkeleton = () => (
  <SurfaceListSkeleton
    cardCount={SKELETON_CARD_COUNT}
    lineCount={SKELETON_LINE_COUNT}
  />
);
