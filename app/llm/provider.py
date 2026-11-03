from typing import Protocol

from app.llm.schemas import ReplyContext, ReplyDraft


class LLMError(Exception):
    """Raised when a provider cannot produce a valid reply draft."""


class LLMProvider(Protocol):
    def generate_reply(self, ctx: ReplyContext) -> ReplyDraft:
        """Return a reply draft or raise LLMError."""
        ...
