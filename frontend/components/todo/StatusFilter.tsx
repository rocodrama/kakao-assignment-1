import { TodoStatus } from "@/lib/types";

const STATUS_LABELS: Record<TodoStatus, string> = {
  all: "전체",
  active: "진행중",
  completed: "완료",
};

type StatusFilterProps = {
  value: TodoStatus;
  onChange: (status: TodoStatus) => void;
};

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="mb-3 flex gap-1 rounded-xl bg-primary/5 p-1">
      {(Object.keys(STATUS_LABELS) as TodoStatus[]).map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            value === status ? "bg-primary text-cream" : "text-primary/60 hover:text-primary"
          }`}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
