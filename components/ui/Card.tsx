import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm border border-warm-gray bg-paper p-6 shadow-sm sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col gap-2 p-5">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="font-body text-sm leading-relaxed text-ink/75">
        {description}
      </p>
    </Card>
  );
}
