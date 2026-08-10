"""FastAPI entry point for the VERIFIBOT API."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from connections.connection_cosmos import initialize_cosmos
from core.config import settings
from routes.chat import router as chat_router
from routes.chats import router as chats_router
from routes.users import router as users_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Create the configured Cosmos database and containers idempotently."""
    await initialize_cosmos()
    yield


app = FastAPI(
    title="VERIFIBOT API",
    description="Authentication, persistent chat history, and evidence-based fact checking.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(users_router)
app.include_router(chats_router)
app.include_router(chat_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "VERIFIBOT API", "docs": "/docs"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
