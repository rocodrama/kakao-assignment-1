"use client";

import Link from "next/link";
import { Todo } from "@/lib/types";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-primary/40">
        등록된 할 일이 없어요
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 rounded-xl border border-primary/10 px-3 py-2"
        >
          <input
            type="checkbox"
            checked={todo.is_completed}
            onChange={() => onToggle(todo.id)}
            className="h-4 w-4 accent-secondary"
          />
          <span
            className={`flex-1 text-sm ${
              todo.is_completed ? "text-primary/40 line-through" : "text-primary"
            }`}
          >
            {todo.title}
          </span>
          <Link
            href={`/todos/${todo.id}`}
            aria-label="수정"
            className="text-primary/40 hover:text-primary"
          >
            ✎
          </Link>
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            aria-label="삭제"
            className="text-primary/40 hover:text-danger"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
