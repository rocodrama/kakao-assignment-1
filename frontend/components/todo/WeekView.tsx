import { Todo } from "@/lib/types";
import { WEEKDAY_LABELS, addDays, isSameDay, toISODate } from "@/lib/date";

type WeekViewProps = {
  weekStart: Date;
  selectedDate: Date;
  todos: Todo[];
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
};

export default function WeekView({
  weekStart,
  selectedDate,
  todos,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}: WeekViewProps) {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = weekDays[6];
  const rangeLabel = `${weekStart.getMonth() + 1}.${weekStart.getDate()} - ${weekEnd.getMonth() + 1}.${weekEnd.getDate()}`;

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevWeek}
          aria-label="이전 주"
          className="rounded-full px-2 py-1 text-primary hover:bg-primary/10"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onToday}
          className="text-xs font-medium text-primary/60 hover:text-primary"
        >
          {rangeLabel}
        </button>
        <button
          type="button"
          onClick={onNextWeek}
          aria-label="다음 주"
          className="rounded-full px-2 py-1 text-primary hover:bg-primary/10"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const todoCount = todos.filter((todo) => todo.date === toISODate(day)).length;

          return (
            <button
              key={toISODate(day)}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 text-sm transition-colors ${
                isSelected
                  ? "bg-primary text-cream"
                  : "text-primary/80 hover:bg-primary/10"
              }`}
            >
              <span className="text-[11px] opacity-70">
                {WEEKDAY_LABELS[i]}
              </span>
              <span
                className={`font-semibold ${
                  isToday && !isSelected ? "text-accent" : ""
                }`}
              >
                {day.getDate()}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  todoCount > 0
                    ? isSelected
                      ? "text-cream/80"
                      : "text-accent"
                    : "text-transparent"
                }`}
              >
                {todoCount > 0 ? todoCount : "0"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
