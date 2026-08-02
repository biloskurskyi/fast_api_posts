from datetime import date
from typing import Self

from pydantic import BaseModel, ConfigDict, model_validator


class DailyCommentStatisticsQuery(BaseModel):
    date_from: date
    date_to: date

    @model_validator(mode="after")
    def range_is_closed_and_past(self) -> Self:
        if self.date_from > self.date_to:
            raise ValueError("date_from must not be after date_to")
        if self.date_to > date.today():
            raise ValueError("date_to must not be in the future")
        return self


class DailyCommentStatistics(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: date
    total_comments: int
    blocked_comments: int
