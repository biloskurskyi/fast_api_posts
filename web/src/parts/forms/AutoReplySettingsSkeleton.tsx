import { SkeletonText } from "@/components/SkeletonText";
import { Surface } from "@/components/Surface";

const TOGGLE_CARD_LINE_COUNT = 2;
const FIELDS_CARD_LINE_COUNT = 6;

export const AutoReplySettingsSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Surface>
      <SkeletonText lineCount={TOGGLE_CARD_LINE_COUNT} />
    </Surface>
    <Surface>
      <SkeletonText lineCount={FIELDS_CARD_LINE_COUNT} />
    </Surface>
  </div>
);
