from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    password = Column(String)
    auto_reply_enabled = Column(Boolean, default=False)
    auto_reply_text = Column(String, default="")
    time_for_auto_reply = Column(Integer, default=0)

    def __repr__(self):
        return f'USER: \nusername:{self.username}'
