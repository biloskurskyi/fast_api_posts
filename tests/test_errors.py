from fastapi.testclient import TestClient

from app.core.errors import AppError, ErrorCode
from app.main import create_app


def build_client() -> TestClient:
    app = create_app()

    @app.get("/error-layer/validated")
    def validated(amount: int) -> int:
        return amount

    @app.get("/error-layer/app-error")
    def app_error() -> None:
        raise AppError(ErrorCode.FORBIDDEN, "You do not own this resource", 403)

    return TestClient(app)


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
