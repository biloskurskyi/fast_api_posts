from collections.abc import Sequence
from http import HTTPStatus
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import AppError, ErrorCode
from app.models.post import Post
from app.models.user import User
from app.repositories.post_repository import PostRepository
from app.schemas.pagination import Pagination
from app.schemas.post import PostWrite


class PostService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]) -> None:
        self.db = db
        self.posts = PostRepository(db)

    def list(self, pagination: Pagination) -> Sequence[Post]:
        return self.posts.paginate(pagination)

    def get(self, post_id: int) -> Post:
        return self.posts.find_or_fail(post_id)

    def create(self, owner: User, data: PostWrite) -> Post:
        post = Post(title=data.title, content=data.content, owner_id=owner.id)
        self.posts.add(post)
        self.db.commit()
        return post

    def update(self, owner: User, post_id: int, data: PostWrite) -> Post:
        post = self.owned(owner, post_id)
        post.title = data.title
        post.content = data.content
        self.db.commit()
        return post

    def delete(self, owner: User, post_id: int) -> None:
        self.posts.delete(self.owned(owner, post_id))
        self.db.commit()

    def owned(self, user: User, post_id: int) -> Post:
        post = self.posts.find_or_fail(post_id)
        if post.owner_id != user.id:
            raise AppError(ErrorCode.FORBIDDEN, "You do not own this post", HTTPStatus.FORBIDDEN)
        return post
