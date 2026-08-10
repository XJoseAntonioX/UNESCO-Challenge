from fastapi import APIRouter

from routes.chats.delete_chats import router as delete_router
from routes.chats.get_chats import router as list_router
from routes.chats.get_messages import router as messages_router
from routes.chats.post_chat import router as create_router

router = APIRouter(prefix="/api/chats", tags=["chats"])
router.include_router(list_router)
router.include_router(messages_router)
router.include_router(create_router)
router.include_router(delete_router)
