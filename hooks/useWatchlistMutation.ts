"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WatchStatus } from "@/types/watchlist";

export type WatchlistPatchBody = {
  status?: WatchStatus;
  episodes_watched?: number;
  score?: number | null;
};

export function useWatchlistMutation(entryId: number) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(
    body: WatchlistPatchBody,
    onSuccess?: () => void,
    onError?: () => void,
  ): Promise<boolean> {
    setIsSaving(true);
    setError(null);

    const response = await fetch(`/api/watchlist/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setIsSaving(false);

    if (!response.ok) {
      setError("Couldn't save. Try again.");
      onError?.();
      return false;
    }

    onSuccess?.();
    router.refresh();
    return true;
  }

  return { mutate, isSaving, error, clearError: () => setError(null) };
}
