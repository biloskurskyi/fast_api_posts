from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user, get_viewer
from app.models.user import User
from app.schemas.comment import CommentResponse, CommentWrite
from app.schemas.identifiers import ResourceId
from app.services.comment_service import CommentService

router = APIRouter(prefix="/comments", tags=["comments"])

CurrentUser = Annotated[User, Depends(get_current_user)]
Viewer = Annotated[User | None, Depends(get_viewer)]
Comments = Annotated[CommentService, Depends()]


@router.get("/{comment_id}")
def show(comment_id: ResourceId, viewer: Viewer, service: Comments) -> CommentResponse:
    return CommentResponse.model_validate(service.get(comment_id, viewer))


@router.put("/{comment_id}")
def update(
    comment_id: ResourceId, data: CommentWrite, user: CurrentUser, service: Comments
) -> CommentResponse:
    return CommentResponse.model_validate(service.update(user, comment_id, data))


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def destroy(comment_id: ResourceId, user: CurrentUser, service: Comments) -> None:
    service.delete(user, comment_id)
