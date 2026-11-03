import logging

from openai import OpenAI

from app.llm.prompts import load_prompt
from app.llm.provider import LLMError
from app.llm.schemas import ReplyContext, ReplyDraft

logger = logging.getLogger(__name__)


class OpenAIProvider:
    def __init__(self, api_key: str, model: str, timeout: float, max_retries: int) -> None:
        self.model = model
        self.client = OpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries)
        self.system_prompt = load_prompt("auto_reply_system").template
        self.user_prompt = load_prompt("auto_reply_user")

    def generate_reply(self, ctx: ReplyContext) -> ReplyDraft:
        try:
            completion = self.client.beta.chat.completions.parse(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": self.user_prompt.safe_substitute(ctx.model_dump())},
                ],
                response_format=ReplyDraft,
            )
            draft = completion.choices[0].message.parsed
        except Exception as error:
            raise LLMError(f"OpenAI request failed: {error}") from error
        if draft is None:
            raise LLMError("OpenAI returned no parsable reply")
        return draft
