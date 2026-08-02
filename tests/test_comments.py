from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.comment import Comment
from tests.factories import (
    PROFANITY,
    auth_headers,
    create_comment,
    create_post,
    create_user,
)


def test_commenting_on_a_post_returns_the_comment(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")

    response = client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read"},
        headers=auth_headers(commenter),
    )

    assert response.status_code == 201
    body = response.json()
    assert body["info"] == "Great read"
    assert body["post_id"] == post.id
    assert body["owner_id"] == commenter.id
    assert body["blocked_at"] is None
    assert db.get(Comment, body["id"]).owner_id == commenter.id


def test_commenting_on_a_missing_post_is_not_found(client: TestClient, db: Session) -> None:
    response = client.post(
        "/posts/999999/comments",
        json={"info": "Into the void"},
        headers=auth_headers(create_user(db, "commenter")),
    )

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "post_not_found"


def test_ownership_and_post_cannot_be_spoofed_from_the_body(
    client: TestClient, db: Session
) -> None:
    post = create_post(db, create_user(db, "author"))
    other_post = create_post(db, create_user(db, "stranger"), title="Other")
    commenter = create_user(db, "commenter")

    response = client.post(
        f"/posts/{post.id}/comments",
        json={"info": "Great read", "post_id": other_post.id, "owner_id": 999},
        headers=auth_headers(commenter),
    )

    assert response.status_code == 201
    assert response.json()["post_id"] == post.id
    assert response.json()["owner_id"] == commenter.id


@pytest.mark.parametrize("payload", [{"info": ""}, {"info": "x" * 2001}, {}])
def test_invalid_comment_payloads_are_rejected(
    client: TestClient, db: Session, payload: dict[str, object]
) -> None:
    post = create_post(db, create_user(db, "author"))

    response = client.post(
        f"/posts/{post.id}/comments",
        json=payload,
        headers=auth_headers(create_user(db, "commenter")),
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_a_profane_comment_is_stored_in_full_and_flagged_to_its_author(
    client: TestClient, db: Session
) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")

    response = client.post(
        f"/posts/{post.id}/comments",
        json={"info": f"This is {PROFANITY} awful"},
        headers=auth_headers(commenter),
    )

    assert response.status_code == 201
    body = response.json()
    assert body["info"] == f"This is {PROFANITY} awful"
    assert body["blocked_at"] is not None
    assert db.get(Comment, body["id"]).blocked_at is not None


def test_a_blocked_comment_is_hidden_from_anonymous_readers(
    client: TestClient, db: Session
) -> None:
    post = create_post(db, create_user(db, "author"))
    blocked = create_comment(
        db, post, create_user(db, "commenter"), blocked_at=datetime.now(UTC)
    )

    response = client.get(f"/comments/{blocked.id}")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "comment_not_found"


def test_a_blocked_comment_is_hidden_from_other_readers(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    blocked = create_comment(
        db, post, create_user(db, "commenter"), blocked_at=datetime.now(UTC)
    )

    response = client.get(
        f"/comments/{blocked.id}", headers=auth_headers(create_user(db, "stranger"))
    )

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "comment_not_found"


def test_the_author_can_read_their_own_blocked_comment(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    blocked = create_comment(db, post, commenter, blocked_at=datetime.now(UTC))

    response = client.get(f"/comments/{blocked.id}", headers=auth_headers(commenter))

    assert response.status_code == 200
    assert response.json()["blocked_at"] is not None


def test_a_clean_edit_clears_the_block(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    blocked = create_comment(db, post, commenter, blocked_at=datetime.now(UTC))

    response = client.put(
        f"/comments/{blocked.id}",
        json={"info": "Rephrased politely"},
        headers=auth_headers(commenter),
    )

    assert response.status_code == 200
    assert response.json()["blocked_at"] is None
    db.refresh(blocked)
    assert blocked.blocked_at is None
    assert blocked.info == "Rephrased politely"


def test_an_edit_into_profanity_blocks_a_clean_comment(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    comment = create_comment(db, post, commenter)

    response = client.put(
        f"/comments/{comment.id}",
        json={"info": f"Actually {PROFANITY} it"},
        headers=auth_headers(commenter),
    )

    assert response.status_code == 200
    assert response.json()["blocked_at"] is not None


def test_reading_a_visible_comment_needs_no_token(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    comment = create_comment(db, post, create_user(db, "commenter"))

    response = client.get(f"/comments/{comment.id}")

    assert response.status_code == 200
    assert response.json()["id"] == comment.id


def test_reading_a_missing_comment_is_not_found(client: TestClient) -> None:
    response = client.get("/comments/999999")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "comment_not_found"


def test_listing_a_posts_comments_needs_no_token_and_is_oldest_first(
    client: TestClient, db: Session
) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    first = create_comment(db, post, commenter, info="First")
    second = create_comment(db, post, commenter, info="Second")

    response = client.get(f"/posts/{post.id}/comments")

    assert response.status_code == 200
    assert [comment["id"] for comment in response.json()] == [first.id, second.id]


def test_listing_excludes_blocked_comments_and_other_posts(
    client: TestClient, db: Session
) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)
    elsewhere = create_post(db, author, title="Elsewhere")
    commenter = create_user(db, "commenter")
    visible = create_comment(db, post, commenter, info="Visible")
    create_comment(db, post, commenter, info="Blocked", blocked_at=datetime.now(UTC))
    create_comment(db, elsewhere, commenter, info="Other post")

    response = client.get(f"/posts/{post.id}/comments")

    assert [comment["id"] for comment in response.json()] == [visible.id]


def test_the_author_sees_their_own_blocked_comment_in_the_listing(
    client: TestClient, db: Session
) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    visible = create_comment(db, post, commenter, info="Visible")
    blocked = create_comment(db, post, commenter, info="Blocked", blocked_at=datetime.now(UTC))

    response = client.get(f"/posts/{post.id}/comments", headers=auth_headers(commenter))

    assert [comment["id"] for comment in response.json()] == [visible.id, blocked.id]


def test_listing_comments_of_a_missing_post_is_not_found(client: TestClient) -> None:
    response = client.get("/posts/999999/comments")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "post_not_found"


def test_listing_honours_skip_and_limit(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    comments = [create_comment(db, post, commenter, info=f"Comment {index}") for index in range(3)]

    response = client.get(f"/posts/{post.id}/comments", params={"skip": 1, "limit": 1})

    assert [comment["id"] for comment in response.json()] == [comments[1].id]


@pytest.mark.parametrize("params", [{"skip": -1}, {"limit": 0}, {"limit": 101}])
def test_invalid_comment_pagination_is_rejected(
    client: TestClient, db: Session, params: dict[str, object]
) -> None:
    post = create_post(db, create_user(db, "author"))

    response = client.get(f"/posts/{post.id}/comments", params=params)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_the_author_can_delete_their_own_comment(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    comment = create_comment(db, post, commenter)

    response = client.delete(f"/comments/{comment.id}", headers=auth_headers(commenter))

    assert response.status_code == 204
    assert response.content == b""
    assert db.get(Comment, comment.id) is None


def test_the_author_can_delete_their_own_blocked_comment(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))
    commenter = create_user(db, "commenter")
    blocked = create_comment(db, post, commenter, blocked_at=datetime.now(UTC))

    response = client.delete(f"/comments/{blocked.id}", headers=auth_headers(commenter))

    assert response.status_code == 204
    assert db.get(Comment, blocked.id) is None


@pytest.mark.parametrize("method", ["put", "delete"])
def test_a_stranger_cannot_change_a_comment(client: TestClient, db: Session, method: str) -> None:
    post = create_post(db, create_user(db, "author"))
    comment = create_comment(db, post, create_user(db, "commenter"))
    stranger = create_user(db, "stranger")

    response = client.request(
        method,
        f"/comments/{comment.id}",
        json={"info": "Hijacked"},
        headers=auth_headers(stranger),
    )

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "forbidden"


@pytest.mark.parametrize("method", ["put", "delete"])
def test_a_missing_comment_is_not_found_before_it_is_forbidden(
    client: TestClient, db: Session, method: str
) -> None:
    response = client.request(
        method,
        "/comments/999999",
        json={"info": "Ghost"},
        headers=auth_headers(create_user(db, "stranger")),
    )

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "comment_not_found"


@pytest.mark.parametrize("method", ["put", "delete"])
def test_comment_writes_require_authentication(
    client: TestClient, db: Session, method: str
) -> None:
    post = create_post(db, create_user(db, "author"))
    comment = create_comment(db, post, create_user(db, "commenter"))

    response = client.request(method, f"/comments/{comment.id}", json={"info": "Anon"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "not_authenticated"


def test_commenting_requires_authentication(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))

    response = client.post(f"/posts/{post.id}/comments", json={"info": "Anon"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "not_authenticated"


def test_deleting_a_post_removes_its_comments(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)
    create_comment(db, post, create_user(db, "commenter"))

    response = client.delete(f"/posts/{post.id}", headers=auth_headers(author))

    assert response.status_code == 204
    assert db.scalars(select(Comment).where(Comment.post_id == post.id)).all() == []
