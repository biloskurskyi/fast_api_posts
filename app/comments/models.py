from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
from ..users.models import User
from ..posts.models import Post

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    info = Column(String)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Post", back_populates="comments")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="comments")

Post.comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
User.comments = relationship("Comment", back_populates="owner", cascade="all, delete-orphan")