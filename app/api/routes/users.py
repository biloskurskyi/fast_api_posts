from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", status_code=status.HTTP_201_CREATED)
def store(data: UserCreate, service: Annotated[UserService, Depends()]) -> UserResponse:
    return UserResponse.model_validate(service.register(data))
