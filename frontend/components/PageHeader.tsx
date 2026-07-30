export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </header>
  );
}
