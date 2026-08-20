"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-stub" role="alert">
        Couldn&apos;t load recommendations.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-sm border border-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink focus-visible:ring-2 focus-visible:ring-ink"
      >
        Try again
      </button>
    </div>
  );
}
