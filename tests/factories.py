from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User

PASSWORD = "sup3r-secret-pass"


def create_user(db: Session, username: str = "tester", is_active: bool = True) -> User:
    user = User(username=username, password_hash=hash_password(PASSWORD), is_active=is_active)
    db.add(user)
    db.commit()
    return user
