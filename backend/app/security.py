from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from app.database import get_db
from app.models import User

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
security = HTTPBearer(auto_error=False)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    now = datetime.now(timezone.utc)
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {'sub': subject, 'exp': now + expires_delta, 'iat': now}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject = payload.get('sub')
        if subject is None:
            raise ValueError('Missing subject')
        return subject
    except jwt.PyJWTError as exc:  # pragma: no cover - library-specific processing
        raise ValueError('Token is invalid or expired') from exc


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or not credentials.credentials:
        demo_email = 'demo@veritas.local'
        user = db.query(User).filter(User.email == demo_email).first()
        if user is None:
            user = User(
                email=demo_email,
                full_name='Demo User',
                hashed_password=get_password_hash('demo-access'),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    try:
        email = decode_access_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found.')
    return user


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication required.')

    return await get_optional_current_user(credentials=credentials, db=db)
