import { useState } from "react";

export default function WeekView({ displayDate, setDisplayDate }) {
  const [weekData, setWeekData] = useState(displayDate);

  const getWeekDays = (date) => {
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handlePrevWeek = () => {
    const prev = new Date(weekData);
    prev.setDate(weekData.getDate() - 7);
    setWeekData(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekData);
    next.setDate(weekData.getDate() + 7);
    setWeekData(next);
  };

  const weekDays = getWeekDays(weekData);
  const today = new Date();
  const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="flex flex-col items-center mb-7">
      <div className="flex flex-row justify-center items-center gap-4 mb-3">
        <span className="text-text-heading font-semibold text-base w-32 text-center">
          {displayDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="flex flex-row gap-1 sm:gap-2">
        <button
          className="bg-white text-black px-1.5 py-1.5 rounded transition-colors hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          onClick={handlePrevWeek}
        >
          &lt;
        </button>
        {weekDays.map((day, i) => {
          const isSelected = isSameDay(day, displayDate);
          const isToday = isSameDay(day, today);
          const isSun = i === 6;
          const isSat = i === 5;

          const labelColor = isSelected
            ? "text-white"
            : isSun
              ? "text-red-500"
              : isSat
                ? "text-blue-500"
                : "text-text-heading";

          return (
            <button
              key={i}
              onClick={() => setDisplayDate(new Date(day))}
              className={`flex flex-col items-center w-9 sm:w-11 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                ${isSelected ? "bg-primary hover:bg-primary-dark" : "hover:bg-primary-light"}`}
            >
              <span className={`text-xs font-medium ${labelColor}`}>
                {DAY_LABELS[i]}
              </span>
              <span
                className={`text-sm font-bold mt-1 ${isSelected ? "text-white" : "text-text-heading"}`}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}
        <button
          className="bg-white text-black px-1.5 py-1.5 rounded transition-colors hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          onClick={handleNextWeek}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
