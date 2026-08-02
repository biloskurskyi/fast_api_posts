import { FEED_EXCERPT_MAX_LENGTH } from "@/constants/limits";
import type { Post, PostDetail, PostDto } from "@/types/post";
import { toExcerpt } from "@/utils/excerpt";
import { isOwnedBy } from "@/utils/ownership";

const toPost = (dto: PostDto): Post => ({
  id: dto.id,
  title: dto.title,
  ownerId: dto.owner_id,
  excerpt: toExcerpt(dto.content, FEED_EXCERPT_MAX_LENGTH),
});

export const toPosts = (dtos: PostDto[]): Post[] => dtos.map(toPost);

export const toPostDetail = (dto: PostDto, viewerId: number | null): PostDetail => ({
  id: dto.id,
  title: dto.title,
  content: dto.content,
  ownerId: dto.owner_id,
  isMine: isOwnedBy(dto.owner_id, viewerId),
});
