import logging

from app.llm.provider import LLMError, LLMProvider
from app.llm.schemas import ReplyContext
from app.models.scheduled_reply import ScheduledReply

logger = logging.getLogger(__name__)


class ReplyComposer:
    """Builds the text of an automatic reply.

    With an LLM provider the owner's template is used as guidance for a generated reply;
    on any LLMError (or without a provider) the plain template reply is used instead.
    The caller still runs the result through the profanity check before saving it.

    Trade-off: the provider is called while the batch's FOR UPDATE locks are held. It is
    bounded by the request timeout, a small AUTO_REPLY_BATCH_SIZE and the template
    fallback. A cleaner design would claim -> mark processing -> commit -> call LLM -> write.
    """

    def __init__(self, provider: LLMProvider | None) -> None:
        self.provider = provider

    def compose(self, reply: ScheduledReply) -> str:
        comment = reply.comment
        owner = comment.post.owner
        template_reply = f"{comment.owner.username}, {owner.auto_reply_text}"
        if self.provider is None:
            return template_reply
        context = ReplyContext(
            post_title=comment.post.title,
            post_body=comment.post.content,
            comment_text=comment.info,
            commenter_username=comment.owner.username,
            owner_template=owner.auto_reply_text,
        )
        try:
            return self.provider.generate_reply(context).text
        except LLMError as error:
            logger.warning("LLM reply failed, using template: %s", error)
            return template_reply
