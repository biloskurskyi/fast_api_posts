from fastapi import FastAPI
from .users.routes import router as user_router
from .database import engine, Base
from .posts.routes import router as posts_router
from .comments.routes import router as comments_router
from .statistic.routes import router as statistic_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(posts_router, prefix="/posts", tags=["posts"])
app.include_router(comments_router, prefix="/comments", tags=["comments"])
app.include_router(statistic_router, prefix="/statistic", tags=["statistic"])
