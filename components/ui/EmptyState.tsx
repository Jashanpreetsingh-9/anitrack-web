import { Button } from "./Button";

export function EmptyState({
  message,
  actionLabel,
  actionHref,
}: {
  message: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-sm border border-dashed border-warm-gray bg-paper/80 px-6 py-12 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-warm-gray">
        {message}
      </p>
      {actionLabel && actionHref && (
        <div className="mt-4">
          <Button variant="secondary" href={actionHref}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="py-16 text-center">
      <p className="animate-pulse-subtle font-mono text-xs uppercase tracking-wide text-warm-gray">
        {label}
      </p>
    </div>
  );
}
