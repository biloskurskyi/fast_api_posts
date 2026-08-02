from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def find_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def find_by_username(self, username: str) -> User | None:
        return self.db.scalar(select(User).where(User.username == username))

    def add(self, user: User) -> None:
        self.db.add(user)
