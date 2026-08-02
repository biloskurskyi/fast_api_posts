from typing import Annotated

from fastapi import Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import AppError, ErrorCode
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]) -> None:
        self.db = db
        self.users = UserRepository(db)

    def register(self, data: UserCreate) -> User:
        user = User(username=data.username, password_hash=hash_password(data.password))
        self.users.add(user)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise AppError(
                ErrorCode.USERNAME_TAKEN,
                "User with this username already registered",
                400,
            ) from None
        return user
