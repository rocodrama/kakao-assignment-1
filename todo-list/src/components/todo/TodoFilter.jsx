export default function TodoFilter({ filter, setFilter }) {
  const FILTERS = ['전체', '완료', '진행중'];

  const baseClass = 'border border-solid text-center w-full sm:w-32 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1';
  const activeClass = 'bg-primary text-white border-primary';
  const inactiveClass = 'bg-white text-black border-surface-border hover:bg-primary hover:text-white hover:border-primary';

  return (
    <div className="flex flex-row justify-between items-center mb-2 gap-2">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`${baseClass} ${filter === f ? activeClass : inactiveClass}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
