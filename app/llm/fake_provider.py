from app.llm.provider import LLMError
from app.llm.schemas import ReplyContext, ReplyDraft


class FakeLLMProvider:
    def __init__(self, reply: str = "Thanks for your comment!", fail: bool = False) -> None:
        self.reply = reply
        self.fail = fail
        self.calls: list[ReplyContext] = []

    def generate_reply(self, ctx: ReplyContext) -> ReplyDraft:
        self.calls.append(ctx)
        if self.fail:
            raise LLMError("fake provider failure")
        return ReplyDraft(text=self.reply)
