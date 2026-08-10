from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError
from pwdlib import PasswordHash

from core.config import settings

password_hash = PasswordHash.recommended()
bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, encoded: str) -> bool:
    return password_hash.verify(password, encoded)


def create_access_token(user_id: str, email: str, name: str = "") -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": user_id,
        "email": email,
        "name": name,
        "iat": now,
        "exp": now + timedelta(minutes=settings.jwt_expiration_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _decode(credentials: HTTPAuthorizationCredentials | None) -> dict | None:
    if credentials is None:
        return None
    try:
        return jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except InvalidTokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesión inválida o vencida") from exc


async def get_optional_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> dict | None:
    return _decode(credentials)


async def get_current_user(user: Annotated[dict | None, Depends(get_optional_user)]) -> dict:
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Debes iniciar sesión")
    return user
