from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.scheduled_reply import ScheduledReply
from app.models.user import User
from app.repositories.comment_repository import CommentRepository
from app.repositories.scheduled_reply_repository import ScheduledReplyRepository
from app.schemas.auto_reply import AutoReplySettingsWrite
from app.services.moderation_service import blocked_at_for


class AutoReplyService:
    def __init__(self, db: Annotated[Session, Depends(get_db)]) -> None:
        self.db = db
        self.replies = ScheduledReplyRepository(db)
        self.comments = CommentRepository(db)

    def update_settings(self, user: User, data: AutoReplySettingsWrite) -> User:
        user.auto_reply_enabled = data.auto_reply_enabled
        user.auto_reply_text = data.auto_reply_text
        user.auto_reply_delay_seconds = data.auto_reply_delay_seconds
        self.db.commit()
        return user

    def schedule(self, post: Post, comment: Comment) -> None:
        if not self.is_configured(post.owner):
            return
        self.replies.add(
            ScheduledReply(
                comment=comment,
                deliver_at=datetime.now(UTC)
                + timedelta(seconds=post.owner.auto_reply_delay_seconds),
            )
        )

    def deliver_due(self) -> int:
        replies = self.replies.claim_due()
        for reply in replies:
            self.deliver(reply)
        self.db.commit()
        return len(replies)

    def deliver(self, reply: ScheduledReply) -> None:
        reply.delivered_at = datetime.now(UTC)
        owner = reply.comment.post.owner
        if not self.is_configured(owner):
            return
        info = f"{reply.comment.owner.username}, {owner.auto_reply_text}"
        self.comments.add(
            Comment(
                info=info,
                post_id=reply.comment.post_id,
                owner_id=owner.id,
                blocked_at=blocked_at_for(info),
            )
        )

    def is_configured(self, owner: User) -> bool:
        return owner.auto_reply_enabled and bool(owner.auto_reply_text)
