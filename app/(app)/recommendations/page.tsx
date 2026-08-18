"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Recommendation = { title: string; reason: string };
type Resolved = Recommendation & { jikan_id: number | null };

const STAGES = [
  "Looking at your watchlist...",
  "Finding patterns in what you watch...",
  "Generating suggestions...",
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Resolved[] | null>(
    null,
  );
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const stageTimer = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 1800);

    async function load() {
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) throw new Error();
        const data: Recommendation[] = await res.json();

        // Resolve each title to a jikan_id via search, in parallel.
        const resolved = await Promise.all(
          data.map(async (rec) => {
            try {
              const searchRes = await fetch(
                `/api/anime/search?q=${encodeURIComponent(rec.title)}`,
              );
              const results = await searchRes.json();
              return { ...rec, jikan_id: results[0]?.jikan_id ?? null };
            } catch {
              return { ...rec, jikan_id: null };
            }
          }),
        );

        if (!cancelled) setRecommendations(resolved);
      } catch {
        if (!cancelled) setError("Couldn't load recommendations right now.");
      } finally {
        clearInterval(stageTimer);
      }
    }

    load();

    return () => {
      cancelled = true;
      clearInterval(stageTimer);
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-stub">
          {error}
        </p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-warm-gray">
          {STAGES[stageIndex]}
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-warm-gray">
          Add a few shows to your watchlist first, then check back here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 font-display text-2xl font-semibold text-ink">
        Recommended for you
      </h1>
      <ul className="space-y-4">
        {recommendations.map((rec) => (
          <li
            key={rec.title}
            className="rounded-sm border border-warm-gray bg-paper p-4 shadow-sm"
          >
            {rec.jikan_id ? (
              <Link
                href={`/anime/${rec.jikan_id}`}
                className="font-display text-sm font-semibold text-ink hover:underline"
              >
                {rec.title}
              </Link>
            ) : (
              <h2 className="font-display text-sm font-semibold text-ink">
                {rec.title}
              </h2>
            )}
            <p className="mt-1 font-body text-sm text-ink/80">{rec.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
