export interface OptionButtonGroupProps<T extends string> {
  title: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
}

export function OptionButtonGroup<T extends string>({
  title,
  options,
  value,
  onChange,
  getLabel,
}: OptionButtonGroupProps<T>) {
  const baseClass =
    "rounded-lg px-4 py-2 text-sm font-medium transition";
  const activeClass =
    "bg-amber-600 text-white dark:bg-amber-500";
  const inactiveClass =
    "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600";

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`${baseClass} ${value === opt ? activeClass : inactiveClass}`}
          >
            {getLabel(opt)}
          </button>
        ))}
      </div>
    </section>
  );
}
