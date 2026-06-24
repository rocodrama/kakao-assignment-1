import TodoCreateForm from "@/components/todo/TodoCreateForm";
import { toISODate } from "@/lib/date";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-primary/10 sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">할 일 추가</h1>
        </header>

        <TodoCreateForm defaultDate={date ?? toISODate(new Date())} />
      </div>
    </div>
  );
}
