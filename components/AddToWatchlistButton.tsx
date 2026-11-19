"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AddToWatchlistButton({
  malId,
  initialInWatchlist,
}: {
  malId: number;
  initialInWatchlist: boolean;
}) {
  const router = useRouter();
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    setIsSaving(true);
    setError(null);

    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mal_id: malId }),
    });

    setIsSaving(false);

    if (!response.ok) {
      setError("Couldn't add. Try again.");
      return;
    }

    setInWatchlist(true);
    router.refresh();
  }

  if (inWatchlist) {
    return (
      <Button variant="secondary" href="/watchlist">
        In watchlist ✓
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button onClick={handleAdd} disabled={isSaving}>
        {isSaving ? "Adding..." : "Add to watchlist"}
      </Button>
      {error && (
        <p className="font-mono text-xs text-stub" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
