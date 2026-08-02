from fastapi import APIRouter

from app.api.routes import (
    auto_reply_settings,
    comments,
    health,
    post_comments,
    posts,
    sessions,
    statistics,
    users,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(users.router)
api_router.include_router(sessions.router)
api_router.include_router(auto_reply_settings.router)
api_router.include_router(posts.router)
api_router.include_router(post_comments.router)
api_router.include_router(comments.router)
api_router.include_router(statistics.router)
