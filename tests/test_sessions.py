from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.factories import PASSWORD, create_user


def test_login_returns_a_bearer_token(client: TestClient, db: Session) -> None:
    create_user(db, "logger")

    response = client.post("/sessions", data={"username": "logger", "password": PASSWORD})

    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    assert response.json()["access_token"]


def test_wrong_password_is_rejected(client: TestClient, db: Session) -> None:
    create_user(db, "logger")

    response = client.post("/sessions", data={"username": "logger", "password": "wrong-password"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_credentials"
    assert response.headers["WWW-Authenticate"] == "Bearer"


def test_unknown_user_is_indistinguishable_from_a_wrong_password(
    client: TestClient, db: Session
) -> None:
    create_user(db, "logger")

    known = client.post("/sessions", data={"username": "logger", "password": "wrong-password"})
    unknown = client.post("/sessions", data={"username": "ghost", "password": PASSWORD})

    assert unknown.status_code == known.status_code
    assert unknown.json() == known.json()


def test_inactive_user_cannot_log_in(client: TestClient, db: Session) -> None:
    create_user(db, "retired", is_active=False)

    response = client.post("/sessions", data={"username": "retired", "password": PASSWORD})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "inactive_user"
