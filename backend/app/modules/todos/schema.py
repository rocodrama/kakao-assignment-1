from pydantic import BaseModel

class TodoCreate(BaseModel):
    title: str
    date: str
    is_completed: bool = False

class TodoUpdate(BaseModel):
    title: str | None = None
    date: str | None = None
    is_completed: bool | None = None

class TodoResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    title: str
    date: str
    is_completed: bool
