"use server";

import { BACKEND_URL } from "@/lib/backend";
import { Todo, TodoStatus } from "@/lib/types";

type GetTodosFilters = {
  date?: string;
  status?: TodoStatus;
  search?: string;
};

export async function getTodos(filters: GetTodosFilters = {}): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (filters.date) params.set("date", filters.date);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);

  const res = await fetch(`${BACKEND_URL}/todos/?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("할 일 목록을 불러오지 못했습니다");
  return res.json();
}

export async function getTodo(id: number): Promise<Todo | null> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("할 일을 불러오지 못했습니다");
  return res.json();
}
