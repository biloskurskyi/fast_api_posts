import logging
from enum import Enum
from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class ErrorCode(str, Enum):
    VALIDATION_ERROR = "validation_error"
    NOT_AUTHENTICATED = "not_authenticated"
    INVALID_TOKEN = "invalid_token"
    INVALID_CREDENTIALS = "invalid_credentials"
    INACTIVE_USER = "inactive_user"
    USERNAME_TAKEN = "username_taken"
    POST_NOT_FOUND = "post_not_found"
    COMMENT_NOT_FOUND = "comment_not_found"
    FORBIDDEN = "forbidden"
    PAYLOAD_TOO_LARGE = "payload_too_large"
    INTERNAL_ERROR = "internal_error"


class AppError(Exception):
    def __init__(
        self,
        code: ErrorCode,
        message: str,
        status_code: int,
        headers: dict[str, str] | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.headers = headers


def unauthenticated(code: ErrorCode, message: str) -> AppError:
    return AppError(code, message, HTTPStatus.UNAUTHORIZED, {"WWW-Authenticate": "Bearer"})


def error_response(
    status_code: int,
    code: str,
    message: str,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message}},
        headers=headers,
    )


def format_validation_errors(exc: RequestValidationError) -> str:
    return "; ".join(
        f"{'.'.join(str(part) for part in error['loc'])}: {error['msg']}" for error in exc.errors()
    )


async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    return error_response(exc.status_code, exc.code.value, exc.message, exc.headers)


async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    return error_response(
        HTTPStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.VALIDATION_ERROR.value,
        format_validation_errors(exc),
    )


async def handle_http_error(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return error_response(
        exc.status_code,
        HTTPStatus(exc.status_code).name.lower(),
        str(exc.detail),
    )


async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return error_response(
        HTTPStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_ERROR.value,
        "Internal server error",
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, handle_app_error)
    app.add_exception_handler(RequestValidationError, handle_validation_error)
    app.add_exception_handler(StarletteHTTPException, handle_http_error)
    app.add_exception_handler(Exception, handle_unexpected_error)
