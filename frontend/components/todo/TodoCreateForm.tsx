"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseISODate, toISODate } from "@/lib/date";
import { API_URL } from "@/lib/api";
import CalendarPicker from "@/components/todo/CalendarPicker";
import CalendarIcon from "@/components/todo/CalendarIcon";

export default function TodoCreateForm({ defaultDate }: { defaultDate: string }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !date) return;

    await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed, date, is_completed: false }),
    });
    router.push("/todos");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-primary/60">
        제목
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="rounded-xl border border-primary/20 bg-transparent px-3 py-2 text-sm text-primary outline-none focus:border-primary"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm text-primary/60">
        날짜
        <div className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-transparent px-3 py-2 text-sm text-primary">
          <span>{date}</span>
          <CalendarPicker
            selectedDate={parseISODate(date)}
            onSelect={(d) => setDate(toISODate(d))}
            triggerClassName="rounded-full p-1.5 text-primary hover:bg-primary/10"
          >
            <CalendarIcon className="h-4 w-4" />
          </CalendarPicker>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <Link
          href="/todos"
          className="flex-1 rounded-xl border border-primary/20 px-4 py-2 text-center text-sm font-medium text-primary"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={!title.trim() || !date}
          className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-cream disabled:opacity-40"
        >
          추가
        </button>
      </div>
    </form>
  );
}
