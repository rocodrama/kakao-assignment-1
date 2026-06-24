import TodoBoard from "@/components/todo/TodoBoard";
import { getTodos } from "@/app/actions";

export default async function TodosPage() {
  const initialTodos = await getTodos();

  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-primary/10 sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">TodoList</h1>
          <p className="mt-1 text-sm text-primary/50">할 일이 너무 많아...🤣</p>
        </header>

        <TodoBoard initialTodos={initialTodos} />
      </div>
    </div>
  );
}
