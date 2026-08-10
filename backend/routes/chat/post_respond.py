from datetime import UTC, datetime
import logging
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from chats.get_chat import get_chat
from chats.get_messages import get_messages
from chats.post_chat import post_chat
from chats.post_message import post_message, update_chat
from core.security import get_optional_user
from models.chat import MessageView, RespondRequest, RespondResponse
from services.factcheck_ai import analyze_claim
from services.factcheck_sources import find_factcheck_sources, has_decisive_google_rating
from services.factcheck_web import find_web_evidence

router = APIRouter()
logger = logging.getLogger(__name__)


def make_message(role: str, content: str, analysis: dict | None = None) -> dict:
    return {
        "id": str(uuid4()),
        "role": role,
        "content": content,
        "createdAt": datetime.now(UTC).isoformat(),
        "analysis": analysis,
    }


@router.post("/respond", response_model=RespondResponse)
async def respond(body: RespondRequest, user: Annotated[dict | None, Depends(get_optional_user)]) -> RespondResponse:
    if user is None and body.chatId is not None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Debes iniciar sesión para guardar chats")

    chat = None
    stored_messages: list[dict] = []
    if user is not None:
        if body.chatId:
            chat = await get_chat(body.chatId, user["sub"])
            if chat is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat no encontrado")
        else:
            now = datetime.now(UTC).isoformat()
            chat = await post_chat(
                {
                    "id": str(uuid4()),
                    "userId": user["sub"],
                    "type": "chat",
                    "title": body.content.strip()[:80],
                    "createdAt": now,
                    "updatedAt": now,
                }
            )
        stored_messages = await get_messages(chat["id"], user["sub"])

    history = stored_messages if user is not None else [message.model_dump() for message in body.history]
    ai_history = [{"role": item["role"], "content": item["content"]} for item in history[-8:]]
    sources = await find_factcheck_sources(body.content)
    web_evidence = ""
    if not has_decisive_google_rating(sources):
        web_sources, web_evidence = await find_web_evidence(body.content)
        known_urls = {str(source.url) for source in sources}
        sources.extend(source for source in web_sources if str(source.url) not in known_urls)
    try:
        analysis = await analyze_claim(body.content, sources, ai_history, web_evidence)
    except Exception as exc:
        # Keep credentials and prompt content out of the response, but preserve
        # the upstream exception in the server log for diagnosis (401/404/429,
        # invalid deployment, network errors, etc.).
        logger.exception("Azure OpenAI request failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="No fue posible consultar el modelo") from exc

    user_message = make_message("user", body.content)
    assistant_message = make_message("assistant", analysis.explanation, analysis.model_dump(mode="json"))

    if user is not None and chat is not None:
        for message in (user_message, assistant_message):
            message.update({"userId": user["sub"], "chatId": chat["id"], "type": "message"})
            await post_message(message)
        chat["updatedAt"] = assistant_message["createdAt"]
        await update_chat(chat)

    return RespondResponse(
        chatId=chat["id"] if chat else None,
        userMessage=MessageView.model_validate(user_message),
        assistantMessage=MessageView.model_validate(assistant_message),
    )
