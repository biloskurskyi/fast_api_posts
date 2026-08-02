from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


class AutoReplySettingsWrite(BaseModel):
    auto_reply_enabled: bool
    auto_reply_text: str = Field(max_length=500)
    auto_reply_delay_seconds: int = Field(ge=0, le=86400)

    @model_validator(mode="after")
    def text_is_required_when_enabled(self) -> Self:
        if self.auto_reply_enabled and not self.auto_reply_text:
            raise ValueError("auto_reply_text must not be empty when auto-reply is enabled")
        return self


class AutoReplySettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    auto_reply_enabled: bool
    auto_reply_text: str
    auto_reply_delay_seconds: int
