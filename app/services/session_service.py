from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import ErrorCode, unauthenticated
from app.core.security import create_access_token, verify_password
from app.repositories.user_repository import UserRepository


class SessionService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]) -> None:
        self.users = UserRepository(db)

    def create(self, username: str, password: str) -> str:
        user = self.users.find_by_username(username)
        if user is None or not verify_password(password, user.password_hash):
            raise unauthenticated(ErrorCode.INVALID_CREDENTIALS, "Incorrect username or password")
        if not user.is_active:
            raise unauthenticated(ErrorCode.INACTIVE_USER, "This account is deactivated")
        return create_access_token(user.id)
