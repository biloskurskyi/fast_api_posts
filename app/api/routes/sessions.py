from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.session import SessionResponse
from app.services.session_service import SessionService

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("")
def store(
    credentials: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: Annotated[SessionService, Depends()],
) -> SessionResponse:
    return SessionResponse(access_token=service.create(credentials.username, credentials.password))
