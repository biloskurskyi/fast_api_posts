from collections.abc import Sequence
from datetime import date
from typing import Annotated

from fastapi import Depends
from sqlalchemy import Row
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.repositories.comment_repository import CommentRepository
from app.schemas.statistics import DailyCommentStatisticsQuery


class StatisticsService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]) -> None:
        self.comments = CommentRepository(db)

    def daily_comments(
        self, owner: User, query: DailyCommentStatisticsQuery
    ) -> Sequence[Row[tuple[date, int, int]]]:
        return self.comments.daily_breakdown(owner, query.date_from, query.date_to)
