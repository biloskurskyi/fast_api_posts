import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from tests.factories import PASSWORD


def test_registration_returns_the_created_user(client: TestClient) -> None:
    response = client.post("/users", json={"username": "newcomer", "password": PASSWORD})

    assert response.status_code == 201
    body = response.json()
    assert body["username"] == "newcomer"
    assert body["is_active"] is True
    assert "password" not in body
    assert "password_hash" not in body


def test_registration_stores_a_hash_not_the_password(client: TestClient, db: Session) -> None:
    client.post("/users", json={"username": "hashed", "password": PASSWORD})

    user = db.query(User).filter(User.username == "hashed").one()
    assert user.password_hash != PASSWORD
    assert user.password_hash.startswith("$2b$")


def test_duplicate_username_is_rejected(client: TestClient) -> None:
    payload = {"username": "twice", "password": PASSWORD}
    client.post("/users", json=payload)

    response = client.post("/users", json=payload)

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "username_taken"


def test_privilege_fields_in_the_body_cannot_escalate(client: TestClient, db: Session) -> None:
    response = client.post(
        "/users",
        json={
            "username": "climber",
            "password": PASSWORD,
            "is_superuser": True,
            "is_active": False,
        },
    )

    assert response.status_code == 201
    assert response.json()["is_active"] is True
    assert "is_superuser" not in response.json()
    assert not hasattr(db.query(User).filter(User.username == "climber").one(), "is_superuser")


@pytest.mark.parametrize(
    "payload",
    [
        {"username": "", "password": PASSWORD},
        {"username": "ab", "password": PASSWORD},
        {"username": "x" * 51, "password": PASSWORD},
        {"username": "has spaces", "password": PASSWORD},
        {"username": "shortpass", "password": "1234567"},
        {"username": "nopass"},
        {"password": PASSWORD},
    ],
)
def test_invalid_registration_payloads_are_rejected(
    client: TestClient, payload: dict[str, object]
) -> None:
    response = client.post("/users", json=payload)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
