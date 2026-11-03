import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.llm.factory import get_llm_provider
from app.llm.fake_provider import FakeLLMProvider
from app.services.auto_reply_service import AutoReplyService
from tests.factories import PROFANITY, auth_headers, create_post, create_user
from tests.test_auto_reply import REPLY_TEXT, configure_auto_reply, replies_on

LLM_TEXT = "Glad you liked it, see you next time!"
COMMENT = "Great read"


def deliver_with(db: Session, provider: FakeLLMProvider | None, client: TestClient):
    author = configure_auto_reply(db, create_user(db, "author"))
    post = create_post(db, author, title="Hello", content="World")
    commenter = create_user(db, "commenter")
    client.post(
        f"/posts/{post.id}/comments", json={"info": COMMENT}, headers=auth_headers(commenter)
    )
    service = AutoReplyService(db)
    service.composer.provider = provider
    assert service.deliver_due() == 1
    return commenter, replies_on(db, post.id, author)


def test_llm_reply_is_used_when_provider_succeeds(client: TestClient, db: Session) -> None:
    commenter, replies = deliver_with(db, FakeLLMProvider(reply=LLM_TEXT), client)

    assert [r.info for r in replies] == [LLM_TEXT]
    assert replies[0].owner.username == "author"


def test_falls_back_to_template_on_llm_error(client: TestClient, db: Session) -> None:
    commenter, replies = deliver_with(db, FakeLLMProvider(fail=True), client)

    assert [r.info for r in replies] == [f"{commenter.username}, {REPLY_TEXT}"]


def test_llm_output_is_still_profanity_checked(client: TestClient, db: Session) -> None:
    _, replies = deliver_with(db, FakeLLMProvider(reply=f"That is {PROFANITY} good"), client)

    assert len(replies) == 1
    assert replies[0].blocked_at is not None


def test_prompt_context_contains_comment_and_template(client: TestClient, db: Session) -> None:
    provider = FakeLLMProvider(reply=LLM_TEXT)

    commenter, _ = deliver_with(db, provider, client)

    assert len(provider.calls) == 1
    context = provider.calls[0]
    assert context.comment_text == COMMENT
    assert context.owner_template == REPLY_TEXT
    assert context.commenter_username == commenter.username
    assert (context.post_title, context.post_body) == ("Hello", "World")


@pytest.mark.parametrize(
    ("name", "expected"), [("none", type(None)), ("fake", FakeLLMProvider)]
)
def test_factory_selects_provider(name: str, expected: type) -> None:
    settings = Settings(database_url="x", secret_key="k" * 32, llm_provider=name)

    assert isinstance(get_llm_provider(settings), expected)


def test_factory_openai_without_key_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    settings = Settings(database_url="x", secret_key="k" * 32, llm_provider="openai")

    with pytest.raises(ValueError):
        get_llm_provider(settings)
