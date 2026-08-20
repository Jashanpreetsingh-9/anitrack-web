"use client";

import { useState } from "react";
import { useWatchlistMutation } from "@/hooks/useWatchlistMutation";

const SCALE = Array.from({ length: 10 }, (_, i) => i + 1);

export function RatingControl({
  entryId,
  initialScore,
}: {
  entryId: number;
  initialScore: number | null;
}) {
  const { mutate, isSaving, error } = useWatchlistMutation(entryId);
  const [score, setScore] = useState(initialScore);

  async function commitScore(n: number) {
    const previous = score;
    const next = n === score ? null : n;
    setScore(next);

    await mutate({ score: next }, undefined, () => setScore(previous));
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
            className={`h-4 flex-1 rounded-sm border transition-colors focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-40 ${
              score !== null && n <= score
                ? "border-ink bg-ink"
                : "border-warm-gray bg-transparent hover:border-ink"
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 font-mono text-[10px] text-stub" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
