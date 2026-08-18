"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SCALE = Array.from({ length: 10 }, (_, i) => i + 1);

export function RatingControl({
  entryId,
  initialScore,
}: {
  entryId: number;
  initialScore: number | null;
}) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function commitScore(n: number) {
    const previous = score;
    const next = n === score ? null : n;
    setScore(next);
    setIsSaving(true);
    setError(null);

    const response = await fetch(`/api/watchlist/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: next }),
    });

    setIsSaving(false);

    if (!response.ok) {
      setScore(previous);
      setError("Couldn't save. Try again.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-1">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wide text-warm-gray">
          Your Score
        </span>
        <span className="font-mono text-[10px] text-warm-gray">
          {score ? `${score}/10` : "—"}
        </span>
      </div>
      <div className="flex gap-0.5">
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => commitScore(n)}
            disabled={isSaving}
            aria-label={`Rate ${n} out of 10`}
            aria-pressed={score === n}
            className={`h-4 flex-1 rounded-sm border transition-colors disabled:opacity-40 ${
              score !== null && n <= score
                ? "border-ink bg-ink"
                : "border-warm-gray bg-transparent hover:border-ink"
            }`}
          />
        ))}
      </div>
      {error && <p className="mt-1 font-mono text-[10px] text-stub">{error}</p>}
    </div>
  );
}
