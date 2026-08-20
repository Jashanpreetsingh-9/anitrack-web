"use client";

import { useWatchlistMutation } from "@/hooks/useWatchlistMutation";
import type { WatchStatus } from "@/types/watchlist";

const STATUS_LABELS: Record<WatchStatus, string> = {
  plan_to_watch: "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};

export function StatusSelect({
  entryId,
  status,
  totalEpisodes,
  onStatusChange,
  onCountChange,
}: {
  entryId: number;
  status: WatchStatus;
  totalEpisodes: number | null;
  onStatusChange: (next: WatchStatus) => void;
  onCountChange: (next: number) => void;
}) {
  const { mutate, isSaving, error } = useWatchlistMutation(entryId);
  const canComplete = totalEpisodes !== null;

  async function handleChange(next: WatchStatus) {
    const prevStatus = status;
    const prevCount =
      totalEpisodes !== null && status === "completed"
        ? totalEpisodes
        : status === "plan_to_watch"
          ? 0
          : undefined;

    const body: { status: WatchStatus; episodes_watched?: number } = {
      status: next,
    };

    if (next === "completed" && totalEpisodes !== null) {
      body.episodes_watched = totalEpisodes;
      onCountChange(totalEpisodes);
    } else if (next === "plan_to_watch") {
      body.episodes_watched = 0;
      onCountChange(0);
    }

    onStatusChange(next);

    await mutate(body, undefined, () => {
      onStatusChange(prevStatus);
      if (prevCount !== undefined) onCountChange(prevCount);
    });
  }

  return (
    <div className="mt-1">
      <label
        htmlFor={`status-${entryId}`}
        className="font-mono text-[10px] uppercase tracking-wide text-warm-gray"
      >
        Status
      </label>
      <select
        id={`status-${entryId}`}
        value={status}
        onChange={(e) => handleChange(e.target.value as WatchStatus)}
        disabled={isSaving}
        aria-label="Watch status"
        className="mt-0.5 w-full rounded-sm border border-warm-gray bg-paper px-2 py-1 font-mono text-xs uppercase tracking-wide text-ink focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-50"
      >
        {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
          ([value, label]) => (
            <option
              key={value}
              value={value}
              disabled={value === "completed" && !canComplete}
            >
              {label}
            </option>
          ),
        )}
      </select>
      {error && (
        <p className="mt-1 font-mono text-[10px] text-stub" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
