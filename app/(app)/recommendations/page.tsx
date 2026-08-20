"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ResolvedRecommendation } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { EmptyState, LoadingBlock } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";

const STAGES = [
  "Looking at your watchlist...",
  "Finding patterns in what you watch...",
  "Generating suggestions...",
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    ResolvedRecommendation[] | null
  >(null);
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
        const data: ResolvedRecommendation[] = await res.json();
        if (!cancelled) setRecommendations(data);
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
      <PageContainer width="md">
        <PageHeader title="Recommended for you" />
        <EmptyState message={error} />
      </PageContainer>
    );
  }

  if (!recommendations) {
    return (
      <PageContainer width="md">
        <PageHeader title="Recommended for you" />
        <LoadingBlock label={STAGES[stageIndex]} />
      </PageContainer>
    );
  }

  if (recommendations.length === 0) {
    return (
      <PageContainer width="md">
        <PageHeader title="Recommended for you" />
        <EmptyState
          message="Add a few shows to your watchlist first, then check back here."
          actionLabel="Go to watchlist"
          actionHref="/watchlist"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="md">
      <PageHeader
        title="Recommended for you"
        description="Personalized picks based on your watch history."
      />
      <ul className="space-y-4">
        {recommendations.map((rec) => (
          <li key={rec.title}>
            <Card className="p-4">
              {rec.mal_id ? (
                <Link
                  href={`/anime/${rec.mal_id}`}
                  className="font-display text-sm font-semibold text-ink hover:underline focus-visible:ring-2 focus-visible:ring-ink"
                >
                  {rec.title}
                </Link>
              ) : (
                <h2 className="font-display text-sm font-semibold text-ink">
                  {rec.title}
                </h2>
              )}
              <p className="mt-1 font-body text-sm text-ink/80">{rec.reason}</p>
            </Card>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
