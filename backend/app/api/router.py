from fastapi import APIRouter
from app.modules.todos.router import router as todos_router

router = APIRouter()
router.include_router(todos_router)
