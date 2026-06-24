"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WeekView from "@/components/todo/WeekView";
import TodoSearch from "@/components/todo/TodoSearch";
import TodoList from "@/components/todo/TodoList";
import CalendarPicker from "@/components/todo/CalendarPicker";
import CalendarIcon from "@/components/todo/CalendarIcon";
import StatusFilter from "@/components/todo/StatusFilter";
import { getTodos } from "@/app/actions";
import { API_URL } from "@/lib/api";
import { Todo, TodoStatus } from "@/lib/types";
import { addDays, formatDisplayDate, parseISODate, startOfWeek, toISODate } from "@/lib/date";

export default function TodoBoard({ initialTodos }: { initialTodos: Todo[] }) {
  const [allTodos, setAllTodos] = useState(initialTodos);
  const [dayTodos, setDayTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<TodoStatus>("all");

  function selectDate(date: Date) {
    setSelectedDate(date);
    setWeekStart(startOfWeek(date));
  }

  async function refreshDayTodos() {
    const data = await getTodos({ date: toISODate(selectedDate), status: statusFilter });
    setDayTodos(data);
  }

  async function refreshAllTodos() {
    setAllTodos(await getTodos());
  }

  useEffect(() => {
    let active = true;
    getTodos({ date: toISODate(selectedDate), status: statusFilter }).then((data) => {
      if (active) setDayTodos(data);
    });
    return () => {
      active = false;
    };
  }, [selectedDate, statusFilter]);

  useEffect(() => {
    const query = searchQuery.trim();
    let active = true;
    const timeout = setTimeout(() => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      getTodos({ search: query }).then((data) => {
        if (active) setSearchResults(data);
      });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  async function toggleTodo(id: number) {
    const current = dayTodos.find((todo) => todo.id === id);
    if (!current) return;
    await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: !current.is_completed }),
    });
    await refreshDayTodos();
  }

  async function deleteTodo(id: number) {
    await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
    await Promise.all([refreshDayTodos(), refreshAllTodos()]);
  }

  return (
    <>
      <div className="relative mb-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs font-medium text-primary/50">선택된 날짜</p>
          <p className="text-lg font-semibold text-primary">{formatDisplayDate(selectedDate)}</p>
        </div>
        <div className="absolute right-0">
          <CalendarPicker
            selectedDate={selectedDate}
            onSelect={selectDate}
            triggerClassName="rounded-full p-1.5 text-primary hover:bg-primary/10"
          >
            <CalendarIcon className="h-5 w-5" />
          </CalendarPicker>
        </div>
      </div>

      <WeekView
        weekStart={weekStart}
        selectedDate={selectedDate}
        todos={allTodos}
        onSelectDate={selectDate}
        onPrevWeek={() => setWeekStart((prev) => addDays(prev, -7))}
        onNextWeek={() => setWeekStart((prev) => addDays(prev, 7))}
        onToday={() => selectDate(new Date())}
      />

      <Link
        href={`/todos/new?date=${toISODate(selectedDate)}`}
        className="mb-4 block w-full rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-cream"
      >
        + 할 일 추가
      </Link>

      <TodoSearch
        query={searchQuery}
        onQueryChange={setSearchQuery}
        results={searchResults}
        onSelectResult={(todo) => selectDate(parseISODate(todo.date))}
      />

      <StatusFilter value={statusFilter} onChange={setStatusFilter} />

      <TodoList todos={dayTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </>
  );
}
