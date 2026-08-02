from datetime import UTC, datetime

from better_profanity import profanity


def blocked_at_for(text: str) -> datetime | None:
    if profanity.contains_profanity(text):
        return datetime.now(UTC)
    return None
