from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password
from app.models.post import Post
from app.models.user import User

PASSWORD = "sup3r-secret-pass"


def create_user(db: Session, username: str = "tester", is_active: bool = True) -> User:
    user = User(username=username, password_hash=hash_password(PASSWORD), is_active=is_active)
    db.add(user)
    db.commit()
    return user


def create_post(
    db: Session, owner: User, title: str = "A title", content: str = "Some content"
) -> Post:
    post = Post(title=title, content=content, owner_id=owner.id)
    db.add(post)
    db.commit()
    return post


def auth_headers(user: User) -> dict[str, str]:
    return {"Authorization": f"Bearer {create_access_token(user.id)}"}
