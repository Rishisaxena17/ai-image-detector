from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.database import get_db
from app.models import User
from app.schemas import TokenOut, UserCreate, UserLogin, UserOut
from app.security import create_access_token, get_current_user, get_password_hash, verify_password

router = APIRouter(prefix='/api/v1', tags=['auth'])


@router.post('/register', response_model=TokenOut)
def register(user: UserCreate, db: Session = Depends(get_db)) -> TokenOut:
    existing = db.query(User).filter(User.email == user.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='An account with that email already exists.')

    db_user = User(
        email=user.email.lower(),
        full_name=user.full_name.strip(),
        hashed_password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(db_user.email)
    return TokenOut(
        access_token=access_token,
        token_type='bearer',
        user=UserOut.model_validate(db_user),
    )


@router.post('/login', response_model=TokenOut)
def login(user: UserLogin, db: Session = Depends(get_db)) -> TokenOut:
    db_user = db.query(User).filter(User.email == user.email.lower()).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password.')

    access_token = create_access_token(db_user.email, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return TokenOut(
        access_token=access_token,
        token_type='bearer',
        user=UserOut.model_validate(db_user),
    )


@router.get('/me', response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
