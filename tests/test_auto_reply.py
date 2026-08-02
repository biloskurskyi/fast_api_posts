from datetime import UTC, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.models.scheduled_reply import ScheduledReply
from app.models.user import User
from app.services.auto_reply_service import AutoReplyService
from tests.factories import PROFANITY, auth_headers, create_comment, create_post, create_user

REPLY_TEXT = "thanks for the comment!"


def configure_auto_reply(
    db: Session, user: User, text: str = REPLY_TEXT, delay: int = 0
) -> User:
    user.auto_reply_enabled = True
    user.auto_reply_text = text
    user.auto_reply_delay_seconds = delay
    db.commit()
    return user


def jobs_for(db: Session, post_id: int) -> list[ScheduledReply]:
    return list(
        db.scalars(
            select(ScheduledReply)
            .join(ScheduledReply.comment)
            .where(Comment.post_id == post_id)
        ).all()
    )


def replies_on(db: Session, post_id: int, owner: User) -> list[Comment]:
    return list(
        db.scalars(
            select(Comment).where(Comment.post_id == post_id, Comment.owner_id == owner.id)
        ).all()
    )


def test_settings_start_disabled(client: TestClient, db: Session) -> None:
    response = client.get(
        "/users/me/auto-reply-settings", headers=auth_headers(create_user(db, "author"))
    )

    assert response.status_code == 200
    assert response.json() == {
        "auto_reply_enabled": False,
        "auto_reply_text": "",
        "auto_reply_delay_seconds": 0,
    }


def test_settings_round_trip(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    payload = {
        "auto_reply_enabled": True,
        "auto_reply_text": REPLY_TEXT,
        "auto_reply_delay_seconds": 30,
    }

    updated = client.put(
        "/users/me/auto-reply-settings", json=payload, headers=auth_headers(author)
    )
    reread = client.get("/users/me/auto-reply-settings", headers=auth_headers(author))

    assert updated.status_code == 200
    assert updated.json() == payload
    assert reread.json() == payload
    db.refresh(author)
    assert author.auto_reply_text == REPLY_TEXT
    assert author.auto_reply_delay_seconds == 30


def test_enabling_without_text_is_rejected(client: TestClient, db: Session) -> None:
    response = client.put(
        "/users/me/auto-reply-settings",
        json={
            "auto_reply_enabled": True,
            "auto_reply_text": "",
            "auto_reply_delay_seconds": 0,
        },
        headers=auth_headers(create_user(db, "author")),
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


@pytest.mark.parametrize(
    "payload",
    [
        {"auto_reply_enabled": False, "auto_reply_text": "", "auto_reply_delay_seconds": -1},
        {"auto_reply_enabled": False, "auto_reply_text": "", "auto_reply_delay_seconds": 86401},
        {
            "auto_reply_enabled": False,
            "auto_reply_text": "x" * 501,
            "auto_reply_delay_seconds": 0,
        },
        {"auto_reply_enabled": True},
    ],
)
def test_invalid_settings_payloads_are_rejected(
    client: TestClient, db: Session, payload: dict[str, object]
) -> None:
    response = client.put(
        "/users/me/auto-reply-settings",
        json=payload,
        headers=auth_headers(create_user(db, "author")),
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


@pytest.mark.parametrize("method", ["get", "put"])
def test_settings_require_authentication(client: TestClient, method: str) -> None:
    response = client.request(
        method,
        "/users/me/auto-reply-settings",
        json={
            "auto_reply_enabled": False,
            "auto_reply_text": "",
            "auto_reply_delay_seconds": 0,
        },
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "not_authenticated"


def test_a_comment_schedules_exactly_one_job(client: TestClient, db: Session) -> None:
    post = create_post(db, configure_auto_reply(db, create_user(db, "author")))

    response = client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )

    assert response.status_code == 201
    jobs = jobs_for(db, post.id)
    assert len(jobs) == 1
    assert jobs[0].comment_id == response.json()["id"]
    assert jobs[0].delivered_at is None


def test_an_unconfigured_owner_schedules_nothing(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))

    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )

    assert jobs_for(db, post.id) == []


def test_a_blocked_comment_schedules_nothing(client: TestClient, db: Session) -> None:
    post = create_post(db, configure_auto_reply(db, create_user(db, "author")))

    response = client.post(
        f"/posts/{post.id}/comments",
        json={"info": f"This is {PROFANITY} awful"},
        headers=auth_headers(create_user(db, "commenter")),
    )

    assert response.json()["blocked_at"] is not None
    assert jobs_for(db, post.id) == []


def test_delivery_writes_the_reply_authored_by_the_post_owner(
    client: TestClient, db: Session
) -> None:
    author = configure_auto_reply(db, create_user(db, "author"))
    post = create_post(db, author)
    commenter = create_user(db, "commenter")
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(commenter),
    )

    assert AutoReplyService(db).deliver_due() == 1

    replies = replies_on(db, post.id, author)
    assert len(replies) == 1
    assert replies[0].info == f"{commenter.username}, {REPLY_TEXT}"
    assert replies[0].blocked_at is None
    assert jobs_for(db, post.id)[0].delivered_at is not None


def test_delivery_does_not_repeat_itself(client: TestClient, db: Session) -> None:
    author = configure_auto_reply(db, create_user(db, "author"))
    post = create_post(db, author)
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )
    service = AutoReplyService(db)

    service.deliver_due()

    assert service.deliver_due() == 0
    assert len(replies_on(db, post.id, author)) == 1


def test_a_comment_cannot_be_scheduled_twice(client: TestClient, db: Session) -> None:
    post = create_post(db, configure_auto_reply(db, create_user(db, "author")))
    comment = create_comment(db, post, create_user(db, "commenter"))

    db.add(ScheduledReply(comment_id=comment.id, deliver_at=datetime.now(UTC)))
    db.add(ScheduledReply(comment_id=comment.id, deliver_at=datetime.now(UTC)))

    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()


def test_a_job_is_not_delivered_before_its_delay_elapses(
    client: TestClient, db: Session
) -> None:
    author = configure_auto_reply(db, create_user(db, "author"), delay=3600)
    post = create_post(db, author)
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )

    assert AutoReplyService(db).deliver_due() == 0
    assert replies_on(db, post.id, author) == []
    assert jobs_for(db, post.id)[0].deliver_at > datetime.now(UTC) + timedelta(minutes=30)


def test_settings_turned_off_before_delivery_write_no_comment(
    client: TestClient, db: Session
) -> None:
    author = configure_auto_reply(db, create_user(db, "author"))
    post = create_post(db, author)
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )
    author.auto_reply_enabled = False
    db.commit()

    assert AutoReplyService(db).deliver_due() == 1

    assert replies_on(db, post.id, author) == []
    assert jobs_for(db, post.id)[0].delivered_at is not None


def test_an_emptied_reply_text_writes_no_comment(client: TestClient, db: Session) -> None:
    author = configure_auto_reply(db, create_user(db, "author"))
    post = create_post(db, author)
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )
    author.auto_reply_text = ""
    db.commit()

    AutoReplyService(db).deliver_due()

    assert replies_on(db, post.id, author) == []


def test_a_profane_reply_text_is_itself_flagged(client: TestClient, db: Session) -> None:
    author = configure_auto_reply(db, create_user(db, "author"), text=f"you are {PROFANITY}")
    post = create_post(db, author)
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(create_user(db, "commenter")),
    )

    AutoReplyService(db).deliver_due()

    replies = replies_on(db, post.id, author)
    assert len(replies) == 1
    assert replies[0].blocked_at is not None


def test_a_delivered_reply_is_visible_to_readers(client: TestClient, db: Session) -> None:
    author = configure_auto_reply(db, create_user(db, "author"))
    post = create_post(db, author)
    commenter = create_user(db, "commenter")
    client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(commenter),
    )
    AutoReplyService(db).deliver_due()

    response = client.get(f"/posts/{post.id}/comments")

    assert [comment["info"] for comment in response.json()] == [
        "Great read",
        f"{commenter.username}, {REPLY_TEXT}",
    ]
