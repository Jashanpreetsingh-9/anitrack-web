import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-warm-gray">
        Anime not found
      </p>
      <Link
        href="/explore"
        className="mt-4 inline-block font-mono text-xs uppercase tracking-wide text-ink underline focus-visible:ring-2 focus-visible:ring-ink"
      >
        Back to explore
      </Link>
    </div>
  );
}
