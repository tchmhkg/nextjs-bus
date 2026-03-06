export interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      {title && (
        <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
      )}
      {children}
    </main>
  );
}
