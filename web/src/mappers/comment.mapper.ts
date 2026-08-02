import type { Comment, CommentDto } from "@/types/comment";
import { formatTimestamp } from "@/utils/formatDate";
import { isOwnedBy } from "@/utils/ownership";

const toComment = (dto: CommentDto, viewerId: number | null): Comment => ({
  id: dto.id,
  info: dto.info,
  ownerId: dto.owner_id,
  createdAt: formatTimestamp(dto.created_at),
  isMine: isOwnedBy(dto.owner_id, viewerId),
  isBlocked: dto.blocked_at !== null,
});

export const toComments = (dtos: CommentDto[], viewerId: number | null): Comment[] =>
  dtos.map((dto) => toComment(dto, viewerId));
