from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auto_reply import AutoReplySettingsResponse, AutoReplySettingsWrite
from app.services.auto_reply_service import AutoReplyService

router = APIRouter(prefix="/users/me/auto-reply-settings", tags=["auto-reply"])

CurrentUser = Annotated[User, Depends(get_current_user)]
AutoReply = Annotated[AutoReplyService, Depends()]


@router.get("")
def show(user: CurrentUser) -> AutoReplySettingsResponse:
    return AutoReplySettingsResponse.model_validate(user)


@router.put("")
def update(
    data: AutoReplySettingsWrite, user: CurrentUser, service: AutoReply
) -> AutoReplySettingsResponse:
    return AutoReplySettingsResponse.model_validate(service.update_settings(user, data))
