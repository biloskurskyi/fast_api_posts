from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CommentWrite(BaseModel):
    info: str = Field(min_length=1, max_length=2000)


class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    info: str
    post_id: int
    owner_id: int
    blocked_at: datetime | None
    created_at: datetime
