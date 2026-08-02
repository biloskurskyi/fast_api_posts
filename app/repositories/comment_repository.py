from collections.abc import Sequence
from http import HTTPStatus

from sqlalchemy import ColumnElement, or_, select
from sqlalchemy.orm import Session

from app.core.errors import AppError, ErrorCode
from app.models.comment import Comment
from app.models.user import User
from app.schemas.pagination import Pagination


def visible_to(viewer: User | None) -> ColumnElement[bool]:
    if viewer is None:
        return Comment.blocked_at.is_(None)
    return or_(Comment.blocked_at.is_(None), Comment.owner_id == viewer.id)


class CommentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def find_or_fail(self, comment_id: int, viewer: User | None) -> Comment:
        comment = self.db.scalars(
            select(Comment).where(Comment.id == comment_id, visible_to(viewer))
        ).first()
        if comment is None:
            raise AppError(ErrorCode.COMMENT_NOT_FOUND, "Comment not found", HTTPStatus.NOT_FOUND)
        return comment

    def paginate(
        self, post_id: int, pagination: Pagination, viewer: User | None
    ) -> Sequence[Comment]:
        return self.db.scalars(
            select(Comment)
            .where(Comment.post_id == post_id, visible_to(viewer))
            .order_by(Comment.created_at, Comment.id)
            .offset(pagination.skip)
            .limit(pagination.limit)
        ).all()

    def add(self, comment: Comment) -> None:
        self.db.add(comment)

    def delete(self, comment: Comment) -> None:
        self.db.delete(comment)
