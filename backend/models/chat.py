from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class Source(BaseModel):
    title: str
    url: HttpUrl
    publisher: str
    rating: str | None = None
    rating_value: int | None = None
    worst_rating: int | None = None
    best_rating: int | None = None
    rating_explanation: str | None = None


class FactCheckResult(BaseModel):
    verdict: Literal["verdadera", "falsa", "parcialmente correcta", "sin evidencia suficiente"]
    explanation: str
    sources: list[Source]


class MessageView(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    createdAt: str
    analysis: FactCheckResult | None = None


class ChatView(BaseModel):
    id: str
    title: str
    createdAt: str
    updatedAt: str


class CreateChatRequest(BaseModel):
    title: str = Field(default="Nueva verificación", min_length=1, max_length=120)


class RespondRequest(BaseModel):
    content: str = Field(min_length=3, max_length=4000)
    chatId: str | None = None
    history: list[MessageView] = Field(default_factory=list, max_length=20)


class RespondResponse(BaseModel):
    chatId: str | None
    userMessage: MessageView
    assistantMessage: MessageView
