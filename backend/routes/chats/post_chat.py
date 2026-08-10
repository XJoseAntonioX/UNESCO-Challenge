from datetime import UTC, datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, status

from chats.post_chat import post_chat
from core.security import get_current_user
from models.chat import ChatView, CreateChatRequest

router = APIRouter()


@router.post("/", response_model=ChatView, status_code=status.HTTP_201_CREATED)
async def create_chat(body: CreateChatRequest, user: Annotated[dict, Depends(get_current_user)]) -> ChatView:
    now = datetime.now(UTC).isoformat()
    document = {
        "id": str(uuid4()),
        "userId": user["sub"],
        "type": "chat",
        "title": body.title.strip(),
        "createdAt": now,
        "updatedAt": now,
    }
    return ChatView.model_validate(await post_chat(document))
