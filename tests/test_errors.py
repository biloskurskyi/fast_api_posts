from fastapi.testclient import TestClient

from app.core.config import settings
from app.core.errors import AppError, ErrorCode
from app.main import create_app


def build_client(raise_server_exceptions: bool = True) -> TestClient:
    app = create_app()

    @app.get("/error-layer/validated")
    def validated(amount: int) -> int:
        return amount

    @app.get("/error-layer/app-error")
    def app_error() -> None:
        raise AppError(ErrorCode.FORBIDDEN, "You do not own this resource", 403)

    @app.get("/error-layer/unexpected")
    def unexpected() -> None:
        raise RuntimeError("something nobody planned for")

    return TestClient(app, raise_server_exceptions=raise_server_exceptions)


def test_invalid_input_returns_the_validation_error_code() -> None:
    response = build_client().get("/error-layer/validated", params={"amount": "not-a-number"})

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
    assert "amount" in response.json()["error"]["message"]


def test_app_error_carries_its_code_and_status() -> None:
    response = build_client().get("/error-layer/app-error")

    assert response.status_code == 403
    assert response.json() == {
        "error": {"code": "forbidden", "message": "You do not own this resource"}
    }


def test_unexpected_errors_keep_the_standard_envelope() -> None:
    response = build_client(raise_server_exceptions=False).get("/error-layer/unexpected")

    assert response.status_code == 500
    assert response.json() == {
        "error": {"code": "internal_error", "message": "Internal server error"}
    }
    assert "something nobody planned for" not in response.text


def test_an_oversized_body_is_rejected_before_it_reaches_a_route() -> None:
    response = build_client().post(
        "/users", content=b"x" * (settings.max_request_body_bytes + 1)
    )

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "payload_too_large"
