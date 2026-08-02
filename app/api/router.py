from fastapi import APIRouter

from app.api.routes import comments, health, post_comments, posts, sessions, users

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(users.router)
api_router.include_router(sessions.router)
api_router.include_router(posts.router)
api_router.include_router(post_comments.router)
api_router.include_router(comments.router)
