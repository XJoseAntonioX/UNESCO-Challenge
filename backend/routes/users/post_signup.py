from datetime import UTC, datetime
from hashlib import sha256

from azure.cosmos.exceptions import CosmosResourceExistsError
from fastapi import APIRouter, HTTPException, status

from core.security import create_access_token, hash_password
from models.user import AuthResponse, SignupCredentials, UserView
from users.post_user import post_user

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(credentials: SignupCredentials) -> AuthResponse:
    email = str(credentials.email).strip().lower()
    user_id = sha256(email.encode("utf-8")).hexdigest()
    document = {
        "id": user_id,
        "email": email,
        "name": credentials.name.strip(),
        "passwordHash": hash_password(credentials.password),
        "createdAt": datetime.now(UTC).isoformat(),
        "type": "user",
    }
    try:
        await post_user(document)
    except CosmosResourceExistsError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya existe una cuenta con ese correo") from exc
    user = UserView(id=user_id, email=email, name=credentials.name.strip())
    return AuthResponse(access_token=create_access_token(user_id, email, credentials.name.strip()), user=user)
