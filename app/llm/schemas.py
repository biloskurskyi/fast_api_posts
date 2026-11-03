from pydantic import BaseModel, Field


class ReplyContext(BaseModel):
    post_title: str
    post_body: str
    comment_text: str
    commenter_username: str
    owner_template: str


class ReplyDraft(BaseModel):
    text: str = Field(min_length=1, max_length=500)
