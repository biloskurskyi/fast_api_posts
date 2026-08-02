import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI

from app.core.config import settings
from app.core.database import SessionLocal
from app.services.auto_reply_service import AutoReplyService

logger = logging.getLogger(__name__)


def deliver_due_replies() -> None:
    with SessionLocal() as db:
        AutoReplyService(db).deliver_due()


async def poll_due_replies() -> None:
    while True:
        await asyncio.sleep(settings.auto_reply_poll_interval_seconds)
        try:
            await asyncio.to_thread(deliver_due_replies)
        except Exception:
            logger.exception("Auto-reply delivery cycle failed")


@asynccontextmanager
async def auto_reply_lifespan(app: FastAPI) -> AsyncIterator[None]:
    worker = asyncio.create_task(poll_due_replies())
    yield
    worker.cancel()
    with suppress(asyncio.CancelledError):
        await worker
