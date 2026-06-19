from fastapi import FastAPI

from app.api.router import router as api_router
from app.db.session import engine
from app.db.base import Base
from app.modules.todos.model import Todo

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

