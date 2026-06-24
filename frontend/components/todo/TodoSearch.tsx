"use client";

import { Todo } from "@/lib/types";
import { parseISODate } from "@/lib/date";

type TodoSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  results: Todo[];
  onSelectResult: (todo: Todo) => void;
};

export default function TodoSearch({
  query,
  onQueryChange,
  results,
  onSelectResult,
}: TodoSearchProps) {
  return (
    <div className="mb-5">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="등록된 할 일 검색"
        className="w-full rounded-xl border border-primary/20 bg-transparent px-3 py-2 text-sm text-primary outline-none focus:border-primary"
      />
      {query.trim() && (
        <ul className="mt-2 max-h-32 overflow-y-auto rounded-xl border border-primary/10">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-primary/40">검색 결과가 없어요</li>
          ) : (
            results.map((todo) => (
              <li key={todo.id}>
                <button
                  type="button"
                  onClick={() => onSelectResult(todo)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-primary hover:bg-primary/10"
                >
                  <span className={todo.is_completed ? "text-primary/40 line-through" : ""}>
                    {todo.title}
                  </span>
                  <span className="text-xs text-primary/40">
                    {parseISODate(todo.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
