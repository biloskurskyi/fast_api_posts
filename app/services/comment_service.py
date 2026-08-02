from collections.abc import Sequence
from http import HTTPStatus
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import AppError, ErrorCode
from app.models.comment import Comment
from app.models.user import User
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository
from app.schemas.comment import CommentWrite
from app.schemas.pagination import Pagination
from app.services.moderation_service import blocked_at_for


class CommentService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]) -> None:
        self.db = db
        self.comments = CommentRepository(db)
        self.posts = PostRepository(db)

    def list(
        self, post_id: int, pagination: Pagination, viewer: User | None
    ) -> Sequence[Comment]:
        self.posts.find_or_fail(post_id)
        return self.comments.paginate(post_id, pagination, viewer)

    def get(self, comment_id: int, viewer: User | None) -> Comment:
        return self.comments.find_or_fail(comment_id, viewer)

    def create(self, owner: User, post_id: int, data: CommentWrite) -> Comment:
        self.posts.find_or_fail(post_id)
        comment = Comment(
            info=data.info,
            post_id=post_id,
            owner_id=owner.id,
            blocked_at=blocked_at_for(data.info),
        )
        self.comments.add(comment)
        self.db.commit()
        return comment

    def update(self, owner: User, comment_id: int, data: CommentWrite) -> Comment:
        comment = self.owned(owner, comment_id)
        comment.info = data.info
        comment.blocked_at = blocked_at_for(data.info)
        self.db.commit()
        return comment

    def delete(self, owner: User, comment_id: int) -> None:
        self.comments.delete(self.owned(owner, comment_id))
        self.db.commit()

    def owned(self, user: User, comment_id: int) -> Comment:
        comment = self.comments.find_or_fail(comment_id, user)
        if comment.owner_id != user.id:
            raise AppError(ErrorCode.FORBIDDEN, "You do not own this comment", HTTPStatus.FORBIDDEN)
        return comment
