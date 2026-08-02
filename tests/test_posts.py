import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.post import Post
from tests.factories import auth_headers, create_post, create_user


def test_creating_a_post_returns_it(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")

    response = client.post(
        "/posts",
        json={"title": "First", "content": "Hello there"},
        headers=auth_headers(author),
    )

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "First"
    assert body["content"] == "Hello there"
    assert body["owner_id"] == author.id
    assert db.get(Post, body["id"]).owner_id == author.id


def test_ownership_cannot_be_spoofed_from_the_body(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    stranger = create_user(db, "stranger")

    response = client.post(
        "/posts",
        json={"title": "First", "content": "Hello there", "owner_id": stranger.id},
        headers=auth_headers(author),
    )

    assert response.status_code == 201
    assert response.json()["owner_id"] == author.id


@pytest.mark.parametrize(
    "payload",
    [
        {"title": "", "content": "Hello there"},
        {"title": "x" * 201, "content": "Hello there"},
        {"title": "First", "content": ""},
        {"title": "First", "content": "x" * 10001},
        {"title": "First"},
        {"content": "Hello there"},
    ],
)
def test_invalid_post_payloads_are_rejected(
    client: TestClient, db: Session, payload: dict[str, object]
) -> None:
    response = client.post("/posts", json=payload, headers=auth_headers(create_user(db, "author")))

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_reading_one_post_needs_no_token(client: TestClient, db: Session) -> None:
    post = create_post(db, create_user(db, "author"))

    response = client.get(f"/posts/{post.id}")

    assert response.status_code == 200
    assert response.json()["id"] == post.id


def test_reading_a_missing_post_returns_not_found(client: TestClient) -> None:
    response = client.get("/posts/999999")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "post_not_found"


def test_listing_posts_needs_no_token_and_is_newest_first(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    older = create_post(db, author, title="Older")
    newer = create_post(db, author, title="Newer")

    response = client.get("/posts")

    assert response.status_code == 200
    assert [post["id"] for post in response.json()] == [newer.id, older.id]


def test_listing_honours_skip_and_limit(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    posts = [create_post(db, author, title=f"Post {index}") for index in range(3)]

    response = client.get("/posts", params={"skip": 1, "limit": 1})

    assert response.status_code == 200
    assert [post["id"] for post in response.json()] == [posts[1].id]


def test_listing_defaults_to_the_first_ten_posts(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    for index in range(11):
        create_post(db, author, title=f"Post {index}")

    response = client.get("/posts")

    assert len(response.json()) == 10


@pytest.mark.parametrize(
    "params",
    [{"skip": -1}, {"limit": 0}, {"limit": 101}, {"skip": "many"}],
)
def test_invalid_pagination_is_rejected(client: TestClient, params: dict[str, object]) -> None:
    response = client.get("/posts", params=params)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_the_owner_can_replace_a_post(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)

    response = client.put(
        f"/posts/{post.id}",
        json={"title": "Rewritten", "content": "New body"},
        headers=auth_headers(author),
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Rewritten"
    assert response.json()["content"] == "New body"
    db.refresh(post)
    assert post.title == "Rewritten"


def test_the_owner_can_delete_a_post(client: TestClient, db: Session) -> None:
    author = create_user(db, "author")
    post = create_post(db, author)

    response = client.delete(f"/posts/{post.id}", headers=auth_headers(author))

    assert response.status_code == 204
    assert response.content == b""
    assert db.get(Post, post.id) is None


@pytest.mark.parametrize("method", ["put", "delete"])
def test_a_stranger_cannot_change_a_post(client: TestClient, db: Session, method: str) -> None:
    post = create_post(db, create_user(db, "author"))
    stranger = create_user(db, "stranger")

    response = client.request(
        method,
        f"/posts/{post.id}",
        json={"title": "Hijacked", "content": "Not mine"},
        headers=auth_headers(stranger),
    )

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "forbidden"


@pytest.mark.parametrize("method", ["put", "delete"])
def test_a_missing_post_is_not_found_before_it_is_forbidden(
    client: TestClient, db: Session, method: str
) -> None:
    response = client.request(
        method,
        "/posts/999999",
        json={"title": "Ghost", "content": "Nothing here"},
        headers=auth_headers(create_user(db, "stranger")),
    )

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "post_not_found"


@pytest.mark.parametrize("method", ["post", "put", "delete"])
def test_writes_require_authentication(client: TestClient, db: Session, method: str) -> None:
    post = create_post(db, create_user(db, "author"))
    url = "/posts" if method == "post" else f"/posts/{post.id}"

    response = client.request(method, url, json={"title": "Anon", "content": "No token"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "not_authenticated"


@pytest.mark.parametrize(
    "url",
    ["/posts/99999999999999999999", "/posts?skip=99999999999999999999"],
)
def test_out_of_range_integers_are_rejected(client: TestClient, url: str) -> None:
    response = client.get(url)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
