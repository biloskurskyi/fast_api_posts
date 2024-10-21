from pydantic import BaseModel
from datetime import date

class DailyCommentStats(BaseModel):
    date: date
    total_comments: int
    blocked_comments: int

class DailyBreakdownResponse(BaseModel):
    stats: list[DailyCommentStats]
