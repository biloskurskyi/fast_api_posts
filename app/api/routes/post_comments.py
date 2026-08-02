from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_user, get_viewer
from app.models.user import User
from app.schemas.comment import CommentResponse, CommentWrite
from app.schemas.pagination import Pagination
from app.services.comment_service import CommentService

router = APIRouter(prefix="/posts/{post_id}/comments", tags=["comments"])

CurrentUser = Annotated[User, Depends(get_current_user)]
Viewer = Annotated[User | None, Depends(get_viewer)]
Comments = Annotated[CommentService, Depends()]


@router.get("")
def index(
    post_id: int,
    pagination: Annotated[Pagination, Query()],
    viewer: Viewer,
    service: Comments,
) -> list[CommentResponse]:
    return [
        CommentResponse.model_validate(comment)
        for comment in service.list(post_id, pagination, viewer)
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
def store(
    post_id: int, data: CommentWrite, user: CurrentUser, service: Comments
) -> CommentResponse:
    return CommentResponse.model_validate(service.create(user, post_id, data))
