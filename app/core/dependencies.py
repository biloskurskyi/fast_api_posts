from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import ErrorCode, unauthenticated
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/sessions", auto_error=False)

INVALID_TOKEN_MESSAGE = "Invalid authentication credentials"


def get_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if token is None:
        raise unauthenticated(ErrorCode.NOT_AUTHENTICATED, "Not authenticated")

    try:
        user_id = decode_access_token(token)
    except InvalidTokenError:
        raise unauthenticated(ErrorCode.INVALID_TOKEN, INVALID_TOKEN_MESSAGE) from None

    user = UserRepository(db).find_by_id(user_id)
    if user is None:
        raise unauthenticated(ErrorCode.INVALID_TOKEN, INVALID_TOKEN_MESSAGE)
    if not user.is_active:
        raise unauthenticated(ErrorCode.INACTIVE_USER, "This account is deactivated")

    return user


def get_viewer(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User | None:
    if token is None:
        return None
    return get_current_user(token, db)
