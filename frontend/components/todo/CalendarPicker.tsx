"use client";

import { useEffect, useRef, useState } from "react";
import {
  WEEKDAY_LABELS,
  addMonths,
  getMonthDays,
  isSameDay,
  startOfMonth,
  toISODate,
} from "@/lib/date";

type CalendarPickerProps = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  triggerClassName?: string;
  children: React.ReactNode;
};

export default function CalendarPicker({
  selectedDate,
  onSelect,
  triggerClassName,
  children,
}: CalendarPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => startOfMonth(selectedDate));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOpen() {
    setViewDate(startOfMonth(selectedDate));
    setOpen((prev) => !prev);
  }

  const days = getMonthDays(viewDate);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button type="button" onClick={toggleOpen} className={triggerClassName}>
        {children}
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-xl bg-white p-3 text-left shadow-xl ring-1 ring-primary/10">
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-primary">
            <button
              type="button"
              onClick={() => setViewDate((v) => addMonths(v, -1))}
              aria-label="이전 달"
              className="rounded-full px-2 text-primary/60 hover:bg-primary/10 hover:text-primary"
            >
              ‹
            </button>
            <span>
              {viewDate.getFullYear()}.
              {String(viewDate.getMonth() + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setViewDate((v) => addMonths(v, 1))}
              aria-label="다음 달"
              className="rounded-full px-2 text-primary/60 hover:bg-primary/10 hover:text-primary"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-primary/40">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
            {days.map((day, i) =>
              day ? (
                <button
                  key={toISODate(day)}
                  type="button"
                  onClick={() => {
                    onSelect(day);
                    setOpen(false);
                  }}
                  className={`rounded-lg py-1 ${
                    isSameDay(day, selectedDate)
                      ? "bg-primary text-cream"
                      : "text-primary hover:bg-primary/10"
                  }`}
                >
                  {day.getDate()}
                </button>
              ) : (
                <span key={`blank-${i}`} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
