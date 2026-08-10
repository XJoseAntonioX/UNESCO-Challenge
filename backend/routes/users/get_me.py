from typing import Annotated

from fastapi import APIRouter, Depends

from core.security import get_current_user
from models.user import UserView

router = APIRouter()


@router.get("/me", response_model=UserView)
async def me(user: Annotated[dict, Depends(get_current_user)]) -> UserView:
    return UserView(id=user["sub"], email=user["email"], name=user.get("name", ""))
