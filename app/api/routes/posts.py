from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.pagination import Pagination
from app.schemas.post import PostResponse, PostWrite
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["posts"])

CurrentUser = Annotated[User, Depends(get_current_user)]
Posts = Annotated[PostService, Depends()]


@router.get("")
def index(pagination: Annotated[Pagination, Query()], service: Posts) -> list[PostResponse]:
    return [PostResponse.model_validate(post) for post in service.list(pagination)]


@router.post("", status_code=status.HTTP_201_CREATED)
def store(data: PostWrite, user: CurrentUser, service: Posts) -> PostResponse:
    return PostResponse.model_validate(service.create(user, data))


@router.get("/{post_id}")
def show(post_id: int, service: Posts) -> PostResponse:
    return PostResponse.model_validate(service.get(post_id))


@router.put("/{post_id}")
def update(post_id: int, data: PostWrite, user: CurrentUser, service: Posts) -> PostResponse:
    return PostResponse.model_validate(service.update(user, post_id, data))


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def destroy(post_id: int, user: CurrentUser, service: Posts) -> None:
    service.delete(user, post_id)
