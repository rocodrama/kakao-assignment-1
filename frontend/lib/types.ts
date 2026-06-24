export type Todo = {
  id: number;
  title: string;
  date: string; // ISO date string, e.g. "2026-06-20"
  is_completed: boolean;
};

export type TodoStatus = "all" | "active" | "completed";
