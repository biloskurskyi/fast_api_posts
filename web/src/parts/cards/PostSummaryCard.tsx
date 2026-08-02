"use client";

import { useTranslation } from "react-i18next";

import { Surface } from "@/components/Surface";
import type { Post } from "@/types/post";

type PostSummaryCardProps = {
  post: Post;
};

export const PostSummaryCard = ({ post }: PostSummaryCardProps) => {
  const { t } = useTranslation("feed");

  return (
    <Surface>
      <article className="flex flex-col gap-2">
        <h2 className="text-text text-title font-serif font-semibold">{post.title}</h2>
        <p className="text-secondary text-meta">{t("row.author", { id: post.ownerId })}</p>
        <p className="text-text text-prose max-w-prose line-clamp-2 font-serif text-pretty md:line-clamp-3">
          {post.excerpt}
        </p>
      </article>
    </Surface>
  );
};
