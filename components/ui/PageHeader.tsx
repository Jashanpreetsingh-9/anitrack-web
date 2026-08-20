export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl font-body text-sm text-ink/70 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-display text-lg font-semibold text-ink">
      {children}
    </h2>
  );
}
