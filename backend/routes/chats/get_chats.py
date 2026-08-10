from typing import Annotated

from fastapi import APIRouter, Depends

from chats.get_chats import get_chats as query_chats
from core.security import get_current_user
from models.chat import ChatView

router = APIRouter()


@router.get("/", response_model=list[ChatView])
async def list_chats(user: Annotated[dict, Depends(get_current_user)]) -> list[ChatView]:
    return [ChatView.model_validate(item) for item in await query_chats(user["sub"])]
