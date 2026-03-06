export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClass = "rounded-lg px-4 py-2 text-sm font-medium transition";
  const variants = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600",
    secondary:
      "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600",
    ghost:
      "text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-700 dark:hover:text-red-400",
  };

  return (
    <button
      type="button"
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
