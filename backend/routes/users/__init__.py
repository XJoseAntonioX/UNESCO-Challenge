from fastapi import APIRouter

from routes.users.get_me import router as me_router
from routes.users.post_login import router as login_router
from routes.users.post_signup import router as signup_router

router = APIRouter(prefix="/api/users", tags=["users"])
router.include_router(signup_router)
router.include_router(login_router)
router.include_router(me_router)
