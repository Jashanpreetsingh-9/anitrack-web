"use client";

import { useState } from "react";
import { AnimeSearchResult } from "@/types/anime";
import { AnimeTicket } from "@/components/AnimeTicket";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    const response = await fetch(
      `/api/anime/search?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      setError("Search failed. Try again.");
      setIsSearching(false);
      return;
    }

    const data: AnimeSearchResult[] = await response.json();
    setResults(data);
    setIsSearching(false);
  }

  async function handleAdd(malId: number) {
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mal_id: malId }),
    });
    if (response.ok) {
      setAddedIds((prev) => new Set(prev).add(malId));
    }
  }

  return (
    <PageContainer width="md">
      <PageHeader
        title="Search"
        description="Find anime and add them to your watchlist."
      />

      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          aria-label="Search anime"
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching} className="sm:shrink-0">
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>

      {error && (
        <p className="mb-4 font-mono text-xs text-stub" role="alert">
          {error}
        </p>
      )}

      {hasSearched && results.length === 0 && !isSearching && !error && (
        <EmptyState message={`No results for "${query}"`} />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {results.map((result) => (
          <AnimeTicket
            key={result.mal_id}
            href={`/anime/${result.mal_id}`}
            title={result.title}
            imageUrl={result.image_url}
          >
            <Button
              type="button"
              onClick={() => handleAdd(result.mal_id)}
              disabled={addedIds.has(result.mal_id)}
              className="mt-1 w-full"
            >
              {addedIds.has(result.mal_id) ? "Added" : "Add"}
            </Button>
          </AnimeTicket>
        ))}
      </div>
    </PageContainer>
  );
}
