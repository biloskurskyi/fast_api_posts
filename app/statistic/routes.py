from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from ..database import get_db
from ..users.models import User
from ..comments.models import Comment  # Імпортуємо модель Comment
from ..auth import get_current_user
from .schemas import DailyBreakdownResponse  # Імпортуємо схеми

router = APIRouter()

today = date.today()


@router.get("/daily-breakdown", response_model=DailyBreakdownResponse)
def get_comments_daily_breakdown(
        date_from: date,
        date_to: date,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if date_from > today:
        raise HTTPException(status_code=400, detail="Enter the date correctly.")

    if date_to and date_to > today:
        date_to = today

    total_comments_query = db.query(
        func.date(Comment.created_at).label("date"),
        func.count(Comment.id).label("total_comments")
    ).filter(
        Comment.created_at >= date_from,
        Comment.created_at <= date_to
    ).group_by(
        func.date(Comment.created_at)
    )

    blocked_comments_query = db.query(
        func.date(Comment.created_at).label("date"),
        func.count(Comment.id).label("blocked_comments")
    ).filter(
        Comment.created_at >= date_from,
        Comment.created_at <= date_to,
        Comment.is_valid == False
    ).group_by(
        func.date(Comment.created_at)
    )

    total_comments_results = total_comments_query.all()
    blocked_comments_results = blocked_comments_query.all()

    breakdown = []
    for date, total in total_comments_results:
        blocked = next((bc for d, bc in blocked_comments_results if d == date), 0)
        breakdown.append({
            "date": date,
            "total_comments": total,
            "blocked_comments": blocked
        })

    return DailyBreakdownResponse(stats=breakdown)
