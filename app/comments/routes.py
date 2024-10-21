from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..users.models import User
from ..posts.routes import Post
from .schemas import CommentResponse, CommentCreate
from ..auth import get_current_user
from .models import Comment
from better_profanity import profanity
import asyncio

router = APIRouter()


async def send_auto_reply(db: Session, comment: Comment, post_owner: User, comment_owner: User):
    await asyncio.sleep(post_owner.time_for_auto_reply)

    reply_text = ""
    if post_owner.auto_reply_enabled and post_owner.auto_reply_text:
        reply_text = f"{comment_owner.username}, {post_owner.auto_reply_text}"

    auto_reply = Comment(
        info=reply_text,
        post_id=comment.post_id,
        owner_id=post_owner.id,
        is_valid=True
    )

    db.add(auto_reply)
    db.commit()
    db.refresh(auto_reply)


def trigger_auto_reply(db: Session, comment: Comment, user: User, comment_owner: User):
    asyncio.create_task(send_auto_reply(db, comment, user, comment_owner))


@router.post("/", response_model=CommentResponse)
async def create_comment(comment: CommentCreate, db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == comment.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    is_valid = not profanity.contains_profanity(comment.info)

    new_comment = Comment(
        info=comment.info,
        post_id=comment.post_id,
        owner_id=current_user.id,
        is_valid=is_valid
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    post_owner = db.query(User).filter(User.id == post.owner_id).first()
    comment_owner = db.query(User).filter(User.id == current_user.id).first()

    if post_owner.auto_reply_enabled and post_owner.auto_reply_text and is_valid:
        trigger_auto_reply(db, new_comment, post_owner, comment_owner)

    return new_comment

@router.get("/{comment_id}", response_model=CommentResponse)
def get_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id, Comment.is_valid == True).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, comment_data: CommentCreate, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id, Comment.is_valid == True).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have a permission to update this comment")

    comment.info = comment_data.info
    comment.is_valid = not profanity.contains_profanity(comment_data.info)

    comment.info = comment_data.info
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/{comment_id}", status_code=204)
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have a permission to delete this comment")

    db.delete(comment)
    db.commit()
