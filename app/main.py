from fastapi import FastAPI

from app.api.router import api_router
from app.core.errors import register_exception_handlers


def create_app() -> FastAPI:
    app = FastAPI(
        title="Posts API",
        description="Posts, comments, moderation, auto-reply and comment statistics.",
        version="2.0.0",
    )
    register_exception_handlers(app)
    app.include_router(api_router)
    return app


app = create_app()
