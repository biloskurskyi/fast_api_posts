"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { PostSummaryCard } from "@/parts/cards/PostSummaryCard";
import { EmptyPanel } from "@/parts/feedback/EmptyPanel";
import type { Post } from "@/types/post";
import { cn } from "@/utils/cn";

type PostFeedListProps = {
  posts: Post[];
  isBusy: boolean;
  isPastTheEnd: boolean;
  onBackToFirstPage: () => void;
};

export const PostFeedList = ({
  posts,
  isBusy,
  isPastTheEnd,
  onBackToFirstPage,
}: PostFeedListProps) => {
  const { t } = useTranslation("feed");

  if (isPastTheEnd) {
    return (
      <EmptyPanel
        title={t("pastTheEnd.title")}
        description={t("pastTheEnd.description")}
        action={
          <Button
            label={t("pastTheEnd.action")}
            type="button"
            variant="secondary"
            isFullWidth={false}
            isDisabled={false}
            isBusy={false}
            onClick={onBackToFirstPage}
          />
        }
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyPanel
        title={t("empty.title")}
        description={t("empty.description", { app: t("app.name", { ns: "common" }) })}
      />
    );
  }

  return (
    <ul aria-busy={isBusy} className={cn("flex flex-col gap-4", isBusy && "opacity-60")}>
      {posts.map((post) => (
        <li key={post.id}>
          <PostSummaryCard post={post} />
        </li>
      ))}
    </ul>
  );
};
