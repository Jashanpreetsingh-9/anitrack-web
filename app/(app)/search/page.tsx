"use client";

import { useState } from "react";
import { AnimeSearchResult } from "@/types/anime";
import { AnimeTicket } from "@/components/AnimeTicket";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    const response = await fetch(
      `/api/anime/search?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      setError("Search failed. Try again.");
      setIsSearching(false);
      return;
    }

    const data = await response.json();
    setResults(data);
    setIsSearching(false);
  }

  async function handleAdd(malId: number) {
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jikan_id: malId }),
    });
    if (response.ok) {
      setAddedIds((prev) => new Set(prev).add(malId));
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Search
      </h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          aria-label="Search anime"
          className="flex-1 rounded-sm border border-warm-gray bg-paper px-3 py-2 font-body text-sm text-ink placeholder:text-warm-gray focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-sm border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-stub hover:border-stub disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="mb-4 font-mono text-xs text-stub">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {results.map((result) => (
          <AnimeTicket
            key={result.jikan_id}
            href={`/anime/${result.jikan_id}`}
            title={result.title}
            imageUrl={result.image_url}
          >
            <button
              onClick={() => handleAdd(result.jikan_id)}
              disabled={addedIds.has(result.jikan_id)}
              className="mt-1 w-full rounded-sm border border-ink bg-ink px-2 py-1 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-stub hover:border-stub disabled:opacity-40"
            >
              {addedIds.has(result.jikan_id) ? "Added" : "Add"}
            </button>
          </AnimeTicket>
        ))}
      </div>
    </div>
  );
}
