"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  status: string;
  onCountChange: (next: number) => void;
  onStatusChange?: (next: string) => void;
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(String(count));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setInputValue(String(count));
  }, [count]);

  function clamp(value: number) {
    const min = Math.max(0, value);
    return totalEpisodes ? Math.min(min, totalEpisodes) : min;
  }

  async function commitCount(next: number) {
    const clamped = clamp(next);
    onCountChange(clamped);
    setInputValue(String(clamped));
    setIsSaving(true);

    const body: { episodes_watched: number; status?: string } = {
      episodes_watched: clamped,
    };

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

    await fetch(`/api/watchlist/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setIsSaving(false);
    router.refresh();
  }

  function handleInputBlur() {
    const parsed = parseInt(inputValue, 10);
    if (Number.isNaN(parsed)) {
      setInputValue(String(count));
      return;
    }
    if (parsed !== count) {
      commitCount(parsed);
    }
  }

  async function handleDelete() {
    await fetch(`/api/watchlist/${entryId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => commitCount(count - 1)}
        disabled={isSaving || count === 0}
        className="rounded-sm border border-warm-gray px-2 py-1 font-mono text-xs disabled:opacity-40"
      >
        −
      </button>
      <input
        type="number"
        min={0}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleInputBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "-" || e.key === "e") e.preventDefault();
        }}
        disabled={isSaving}
        className="w-12 [appearance:textfield] rounded-sm border border-warm-gray bg-paper px-1 py-1 text-center font-mono text-xs text-ink focus:border-ink focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {totalEpisodes && (
        <span className="font-mono text-xs text-warm-gray">
          / {totalEpisodes}
        </span>
      )}
      <button
        onClick={() => commitCount(count + 1)}
        disabled={
          isSaving || (totalEpisodes !== null && count >= totalEpisodes)
        }
        className="rounded-sm border border-warm-gray px-2 py-1 font-mono text-xs disabled:opacity-40"
      >
        +
      </button>
      <button
        onClick={handleDelete}
        className="ml-1 font-mono text-xs text-stub hover:underline"
      >
        Remove
      </button>
    </div>
  );
}
