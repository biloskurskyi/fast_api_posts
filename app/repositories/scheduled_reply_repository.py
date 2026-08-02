from collections.abc import Sequence
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.comment import Comment
from app.models.post import Post
from app.models.scheduled_reply import ScheduledReply


class ScheduledReplyRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def claim_due(self) -> Sequence[ScheduledReply]:
        return self.db.scalars(
            select(ScheduledReply)
            .where(
                ScheduledReply.delivered_at.is_(None),
                ScheduledReply.deliver_at <= datetime.now(UTC),
            )
            .order_by(ScheduledReply.deliver_at, ScheduledReply.id)
            .with_for_update(skip_locked=True, of=ScheduledReply)
            .options(
                selectinload(ScheduledReply.comment).options(
                    selectinload(Comment.owner),
                    selectinload(Comment.post).selectinload(Post.owner),
                )
            )
        ).all()

    def add(self, reply: ScheduledReply) -> None:
        self.db.add(reply)
