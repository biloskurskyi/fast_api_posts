from collections.abc import Generator
from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
import pytest
from fastapi import Depends
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import create_access_token
from app.main import create_app
from app.models.user import User
from tests.factories import create_user


@pytest.fixture
def protected_client(db: Session) -> Generator[TestClient, None, None]:
    app = create_app()

    @app.get("/protected")
    def protected(user: Annotated[User, Depends(get_current_user)]) -> str:
        return user.username

    def override_get_db() -> Generator[Session, None, None]:
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def sign(claims: dict[str, object]) -> str:
    return jwt.encode(claims, settings.secret_key, algorithm=settings.algorithm)


def test_a_valid_token_resolves_its_owner(protected_client: TestClient, db: Session) -> None:
    user = create_user(db, "bearer")

    response = protected_client.get(
        "/protected", headers={"Authorization": f"Bearer {create_access_token(user.id)}"}
    )

    assert response.status_code == 200
    assert response.json() == "bearer"


def test_the_documented_token_url_is_the_session_endpoint(protected_client: TestClient) -> None:
    schemes = protected_client.get("/openapi.json").json()["components"]["securitySchemes"]

    assert schemes["OAuth2PasswordBearer"]["flows"]["password"]["tokenUrl"] == "/sessions"


def test_a_missing_token_is_rejected(protected_client: TestClient) -> None:
    response = protected_client.get("/protected")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "not_authenticated"
    assert response.headers["WWW-Authenticate"] == "Bearer"


@pytest.mark.parametrize(
    "token",
    [
        "not-a-jwt",
        jwt.encode({"sub": "1"}, "another-signing-key", algorithm="HS256"),
    ],
)
def test_a_malformed_or_forged_token_is_rejected(
    protected_client: TestClient, token: str
) -> None:
    response = protected_client.get("/protected", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_token"


def test_an_expired_token_is_rejected(protected_client: TestClient, db: Session) -> None:
    user = create_user(db, "expired")
    token = sign({"sub": str(user.id), "exp": datetime.now(UTC) - timedelta(minutes=1)})

    response = protected_client.get("/protected", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_token"


def test_a_token_without_a_subject_is_rejected(protected_client: TestClient) -> None:
    token = sign({"exp": datetime.now(UTC) + timedelta(minutes=5)})

    response = protected_client.get("/protected", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_token"


def test_a_token_for_a_missing_user_is_rejected(protected_client: TestClient) -> None:
    response = protected_client.get(
        "/protected", headers={"Authorization": f"Bearer {create_access_token(999999)}"}
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_token"


def test_an_inactive_user_is_rejected(protected_client: TestClient, db: Session) -> None:
    user = create_user(db, "retired", is_active=False)

    response = protected_client.get(
        "/protected", headers={"Authorization": f"Bearer {create_access_token(user.id)}"}
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "inactive_user"
