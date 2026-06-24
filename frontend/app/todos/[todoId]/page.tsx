import TodoEditForm from "@/components/todo/TodoEditForm";
import { getTodo } from "@/app/actions";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodo(Number(todoId));

  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-primary/10 sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">할 일 수정</h1>
        </header>

        <TodoEditForm todoId={Number(todoId)} initialTodo={todo} />
      </div>
    </div>
  );
}
