"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
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
  status: string;
  totalEpisodes: number | null;
  onStatusChange: (next: string) => void;
  onCountChange: (next: number) => void;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const canComplete = totalEpisodes !== null;

  async function handleChange(next: string) {
    const body: { status: string; episodes_watched?: number } = {
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
    setIsSaving(true);

    await fetch(`/api/watchlist/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setIsSaving(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isSaving}
      className="rounded-sm border border-warm-gray bg-paper px-2 py-1 font-mono text-xs uppercase tracking-wide text-ink focus:border-ink focus:outline-none disabled:opacity-50"
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option
          key={value}
          value={value}
          disabled={value === "completed" && !canComplete}
        >
          {label}
        </option>
      ))}
    </select>
  );
}
