from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.todos.model import Todo
from app.modules.todos.schema import TodoCreate, TodoUpdate


class TodoRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Todo]:
        return list(self.db.scalars(select(Todo)))

    def get_by_id(self, todo_id: int) -> Todo | None:
        return self.db.get(Todo, todo_id)

    def create(self, data: TodoCreate) -> Todo:
        todo = Todo(**data.model_dump()) # model_dump() 이후 **로 언패킹
        self.db.add(todo) # DB 세션에 새로 생성된 todo 객체를 추가.
        self.db.commit() # DB 세션에 대한 변경 사항을 데이터베이스에 커밋하여 저장.
        self.db.refresh(todo) # DB 세션에서 todo 객체를 새로 고쳐서 데이터베이스에 저장된 최신 상태로 업데이트.
        return todo

    def update(self, todo: Todo, data: TodoUpdate) -> Todo:
        # exclude_unset=True는 TodoUpdate 모델에서 값이 변경된 필드만 반환하도록 지정하는 옵션입니다.
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(todo, field, value)
        self.db.commit()
        self.db.refresh(todo)
        return todo

    def delete(self, todo: Todo) -> None:
        self.db.delete(todo)
        self.db.commit()
