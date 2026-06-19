from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[str] = mapped_column(nullable=False)
    is_completed: Mapped[bool] = mapped_column(nullable=False, default=False)

