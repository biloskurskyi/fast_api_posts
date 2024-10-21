from datetime import date

from pydantic import BaseModel


class DailyCommentStats(BaseModel):
    date: date
    total_comments: int
    blocked_comments: int

class DailyBreakdownResponse(BaseModel):
    stats: list[DailyCommentStats]
