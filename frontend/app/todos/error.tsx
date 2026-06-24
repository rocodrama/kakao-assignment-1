"use client";

export default function TodosError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center gap-4 px-4 py-10">
      <p className="text-sm text-primary/60">문제가 발생했어요</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-cream"
      >
        다시 시도
      </button>
    </div>
  );
}
