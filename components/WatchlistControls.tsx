"use client";

import { useState } from "react";
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
  initialStatus: string;
  initialScore: number | null;
  totalEpisodes: number | null;
}) {
  const [count, setCount] = useState(initialCount);
  const [status, setStatus] = useState(initialStatus);

  return (
    <>
      <div className="mt-1 flex items-center gap-2">
        <EpisodeStepper
          entryId={entryId}
          count={count}
          totalEpisodes={totalEpisodes}
          status={status}
          onCountChange={setCount}
          onStatusChange={setStatus}
        />
      </div>
      <StatusSelect
        entryId={entryId}
        status={status}
        totalEpisodes={totalEpisodes}
        onStatusChange={setStatus}
        onCountChange={setCount}
      />
      <RatingControl entryId={entryId} initialScore={initialScore} />
    </>
  );
}
