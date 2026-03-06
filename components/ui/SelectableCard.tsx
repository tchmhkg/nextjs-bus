export interface SelectableCardProps {
  label: string;
  description?: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export function SelectableCard({
  label,
  description,
  onClick,
  children,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border-2 border-zinc-200 bg-white p-4 text-left transition hover:border-amber-500 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-amber-500 dark:hover:bg-amber-900/20"
    >
      <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
        {label}
      </span>
      {description && (
        <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
          {description}
        </p>
      )}
      {children}
    </button>
  );
}
