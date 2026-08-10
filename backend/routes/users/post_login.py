from hashlib import sha256

from fastapi import APIRouter, HTTPException, status

from core.security import create_access_token, verify_password
from models.user import AuthResponse, Credentials, UserView
from users.get_user import get_user

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
async def login(credentials: Credentials) -> AuthResponse:
    email = str(credentials.email).strip().lower()
    user_id = sha256(email.encode("utf-8")).hexdigest()
    document = await get_user(user_id, email)
    if document is None or not verify_password(credentials.password, document["passwordHash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contraseña incorrectos")
    name = document.get("name", "")
    user = UserView(id=user_id, email=email, name=name)
    return AuthResponse(access_token=create_access_token(user_id, email, name), user=user)
