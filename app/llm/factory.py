import os

from app.core.config import Settings
from app.llm.fake_provider import FakeLLMProvider
from app.llm.openai_provider import OpenAIProvider
from app.llm.provider import LLMProvider


def get_llm_provider(settings: Settings) -> LLMProvider | None:
    match settings.llm_provider:
        case "none":
            return None
        case "fake":
            return FakeLLMProvider()
        case "openai":
            api_key = os.environ.get("OPENAI_API_KEY", "")
            if not api_key:
                raise ValueError("LLM_PROVIDER=openai requires OPENAI_API_KEY")
            return OpenAIProvider(
                api_key=api_key,
                model=settings.llm_model,
                timeout=settings.llm_timeout_seconds,
                max_retries=settings.llm_max_retries,
            )
        case other:
            raise ValueError(f"Unknown LLM_PROVIDER: {other}")
