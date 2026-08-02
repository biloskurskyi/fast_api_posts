from pydantic import BaseModel, Field

from app.schemas.identifiers import MAX_SIGNED_INT32


class Pagination(BaseModel):
    skip: int = Field(default=0, ge=0, le=MAX_SIGNED_INT32)
    limit: int = Field(default=10, ge=1, le=100)
