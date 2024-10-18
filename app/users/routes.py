from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .models import User
from .schemas import UserCreate, UserResponse
from ..database import get_db
from ..utils import hash_password, verify_password
from ..auth import create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this username already registered")

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.username,
        password=hashed_password,
        is_active=user.is_active,
        is_superuser=user.is_superuser
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": existing_user.username})
    return {"access_token": access_token, "token_type": "bearer"}
