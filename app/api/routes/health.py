from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health")
def show() -> HealthResponse:
    return HealthResponse(status="ok")
