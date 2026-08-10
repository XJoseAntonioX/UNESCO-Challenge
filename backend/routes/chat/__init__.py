from fastapi import APIRouter

from routes.chat.post_respond import router as respond_router

router = APIRouter(prefix="/api/chat", tags=["chat"])
router.include_router(respond_router)
