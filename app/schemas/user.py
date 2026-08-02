from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.security import BCRYPT_MAX_PASSWORD_BYTES


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50, pattern=r"^[A-Za-z0-9_.-]+$")
    password: str = Field(min_length=8, max_length=BCRYPT_MAX_PASSWORD_BYTES)

    @field_validator("password")
    @classmethod
    def fits_the_hashing_algorithm(cls, password: str) -> str:
        if len(password.encode()) > BCRYPT_MAX_PASSWORD_BYTES:
            raise ValueError(f"password must not exceed {BCRYPT_MAX_PASSWORD_BYTES} bytes")
        return password


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    is_active: bool
