from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.statistics import DailyCommentStatistics, DailyCommentStatisticsQuery
from app.services.statistics_service import StatisticsService

router = APIRouter(prefix="/statistics", tags=["statistics"])

CurrentUser = Annotated[User, Depends(get_current_user)]
Statistics = Annotated[StatisticsService, Depends()]


@router.get("/daily-comments")
def index(
    query: Annotated[DailyCommentStatisticsQuery, Query()],
    user: CurrentUser,
    service: Statistics,
) -> list[DailyCommentStatistics]:
    return [
        DailyCommentStatistics.model_validate(row) for row in service.daily_comments(user, query)
    ]
