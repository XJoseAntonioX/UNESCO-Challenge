from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status

from chats.delete_chats import delete_all_chats_with_messages, delete_chat_with_messages
from core.security import get_current_user

router = APIRouter()


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_chats(user: Annotated[dict, Depends(get_current_user)]) -> Response:
    await delete_all_chats_with_messages(user["sub"])
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: str, user: Annotated[dict, Depends(get_current_user)]) -> Response:
    if not await delete_chat_with_messages(chat_id, user["sub"]):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat no encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
