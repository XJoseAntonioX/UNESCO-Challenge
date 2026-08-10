from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from chats.get_chat import get_chat
from chats.get_messages import get_messages
from core.security import get_current_user
from models.chat import MessageView

router = APIRouter()


@router.get("/{chat_id}/messages", response_model=list[MessageView])
async def list_messages(chat_id: str, user: Annotated[dict, Depends(get_current_user)]) -> list[MessageView]:
    if await get_chat(chat_id, user["sub"]) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat no encontrado")
    return [MessageView.model_validate(item) for item in await get_messages(chat_id, user["sub"])]
