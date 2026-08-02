import { FEED_EXCERPT_MAX_LENGTH } from "@/constants/limits";
import type { Post, PostDto } from "@/types/post";
import { toExcerpt } from "@/utils/excerpt";

const toPost = (dto: PostDto): Post => ({
  id: dto.id,
  title: dto.title,
  ownerId: dto.owner_id,
  excerpt: toExcerpt(dto.content, FEED_EXCERPT_MAX_LENGTH),
});

export const toPosts = (dtos: PostDto[]): Post[] => dtos.map(toPost);
