"use client";

import { useState } from "react";
import type { WatchStatus } from "@/types/watchlist";
import { EpisodeStepper } from "@/components/EpisodeStepper";
import { StatusSelect } from "@/components/StatusSelect";
import { RatingControl } from "@/components/RatingControl";

export function WatchlistControls({
  entryId,
  initialCount,
  initialStatus,
  initialScore,
  totalEpisodes,
}: {
  entryId: number;
  initialCount: number;
  initialStatus: WatchStatus;
  initialScore: number | null;
  totalEpisodes: number | null;
}) {
  const [count, setCount] = useState(initialCount);
  const [status, setStatus] = useState<WatchStatus>(initialStatus);

  return (
    <div className="mt-1 flex flex-col gap-2">
      <EpisodeStepper
        entryId={entryId}
        count={count}
        totalEpisodes={totalEpisodes}
        status={status}
        onCountChange={setCount}
        onStatusChange={setStatus}
      />
      <StatusSelect
        entryId={entryId}
        status={status}
        totalEpisodes={totalEpisodes}
        onStatusChange={setStatus}
        onCountChange={setCount}
      />
      <RatingControl entryId={entryId} initialScore={initialScore} />
    </div>
  );
}
