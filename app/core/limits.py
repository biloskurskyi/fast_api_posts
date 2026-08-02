from collections.abc import Awaitable, Callable
from http import HTTPStatus

from fastapi import Request, Response

from app.core.config import settings
from app.core.errors import ErrorCode, error_response


async def reject_oversized_body(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    content_length = request.headers.get("content-length")
    if content_length is not None and int(content_length) > settings.max_request_body_bytes:
        return error_response(
            HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
            ErrorCode.PAYLOAD_TOO_LARGE.value,
            "Request body is too large",
        )
    return await call_next(request)
