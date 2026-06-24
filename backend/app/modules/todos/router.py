from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.todos.repository import TodoRepository
from app.modules.todos.schema import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter(prefix="/todos", tags=["todos"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TodoResponse)
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db)
):
    repository = TodoRepository(db)
    return repository.create(todo)

@router.get("/", response_model=list[TodoResponse])
def get_todos(
    date: str | None = None,
    status: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    is_completed = None
    if status == "active":
        is_completed = False
    elif status == "completed":
        is_completed = True

    repository = TodoRepository(db)
    return repository.get_all(date=date, is_completed=is_completed, search=search)

@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    repository = TodoRepository(db)
    todo = repository.get_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo

@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    data: TodoUpdate,
    db: Session = Depends(get_db)
):
    repository = TodoRepository(db)
    todo = repository.get_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return repository.update(todo, data)

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    repository = TodoRepository(db)
    todo = repository.get_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    repository.delete(todo)
    return