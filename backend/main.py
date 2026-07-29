"""Minimal FastAPI entry point for the future VERIFIBOT backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="VERIFIBOT API",
    description="Backend reference for the VERIFIBOT platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    """Describe the reference service."""
    return {"message": "VERIFIBOT API reference", "docs": "/docs"}


@app.get("/health")
async def health() -> dict[str, str]:
    """Expose a basic health check for local development and deployment."""
    return {"status": "ok"}

