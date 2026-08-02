from collections.abc import Sequence
from http import HTTPStatus

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import AppError, ErrorCode
from app.models.post import Post
from app.schemas.pagination import Pagination


class PostRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def find_or_fail(self, post_id: int) -> Post:
        post = self.db.get(Post, post_id)
        if post is None:
            raise AppError(ErrorCode.POST_NOT_FOUND, "Post not found", HTTPStatus.NOT_FOUND)
        return post

    def paginate(self, pagination: Pagination) -> Sequence[Post]:
        return self.db.scalars(
            select(Post)
            .order_by(Post.created_at.desc(), Post.id.desc())
            .offset(pagination.skip)
            .limit(pagination.limit)
        ).all()

    def add(self, post: Post) -> None:
        self.db.add(post)

    def delete(self, post: Post) -> None:
        self.db.delete(post)
