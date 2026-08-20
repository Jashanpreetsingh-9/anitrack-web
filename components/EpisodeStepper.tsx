"use client";

import { useState } from "react";
import { useWatchlistMutation } from "@/hooks/useWatchlistMutation";
import type { WatchStatus } from "@/types/watchlist";

import { Button } from "@/components/ui/Button";

export function EpisodeStepper({
  entryId,
  count,
  totalEpisodes,
  status,
  onCountChange,
  onStatusChange,
}: {
  entryId: number;
  count: number;
  totalEpisodes: number | null;
  status: WatchStatus;
  onCountChange: (next: number) => void;
  onStatusChange?: (next: WatchStatus) => void;
}) {
  const { mutate, isSaving, error } = useWatchlistMutation(entryId);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(count));

  function clamp(value: number) {
    const min = Math.max(0, value);
    return totalEpisodes ? Math.min(min, totalEpisodes) : min;
  }

  async function commitCount(next: number) {
    const clamped = clamp(next);
    const prevCount = count;
    const prevStatus = status;

    onCountChange(clamped);
    setInputValue(String(clamped));

    const body: {
      episodes_watched: number;
      status?: WatchStatus;
    } = { episodes_watched: clamped };

    const atTotal = totalEpisodes !== null && clamped === totalEpisodes;
    const atZero = clamped === 0;

    if (atTotal && status !== "completed") {
      body.status = "completed";
      onStatusChange?.("completed");
    } else if (atZero && status !== "plan_to_watch") {
      body.status = "plan_to_watch";
      onStatusChange?.("plan_to_watch");
    } else if (
      !atTotal &&
      !atZero &&
      (status === "completed" || status === "plan_to_watch")
    ) {
      body.status = "watching";
      onStatusChange?.("watching");
    }

    await mutate(body, undefined, () => {
      onCountChange(prevCount);
      onStatusChange?.(prevStatus);
      setInputValue(String(prevCount));
    });
  }

  function handleInputFocus() {
    setIsEditing(true);
    setInputValue(String(count));
  }

  function handleInputBlur() {
    setIsEditing(false);
    const parsed = parseInt(inputValue, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    if (parsed !== count) {
      commitCount(parsed);
    }
  }

  async function handleDelete() {
    if (!confirm("Remove this anime from your watchlist?")) return;
    const response = await fetch(`/api/watchlist/${entryId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => commitCount(count - 1)}
          disabled={isSaving || count === 0}
          aria-label="Decrease episode count"
        >
          −
        </Button>
        <input
          type="number"
          min={0}
          value={isEditing ? inputValue : String(count)}
          onFocus={handleInputFocus}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          disabled={isSaving}
          aria-label="Episodes watched"
          className="w-12 [appearance:textfield] rounded-sm border border-warm-gray bg-paper px-1 py-1 text-center font-mono text-xs text-ink focus-visible:ring-2 focus-visible:ring-ink [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {totalEpisodes && (
          <span className="font-mono text-xs text-warm-gray">
            / {totalEpisodes}
          </span>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => commitCount(count + 1)}
          disabled={
            isSaving || (totalEpisodes !== null && count >= totalEpisodes)
          }
          aria-label="Increase episode count"
        >
          +
        </Button>
        <button
          type="button"
          onClick={handleDelete}
          className="ml-1 font-mono text-xs text-stub hover:underline focus-visible:ring-2 focus-visible:ring-ink"
        >
          Remove
        </button>
      </div>
      {error && (
        <p className="font-mono text-[10px] text-stub" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
