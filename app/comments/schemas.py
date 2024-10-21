from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    info: str
    post_id: int

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    owner_id: int
    created_at: datetime


    class Config:
        orm_mode = True
