import { getWatchlist } from "@/lib/api/watchlist";
import { AnimeTicket } from "@/components/AnimeTicket";
import { WatchlistControls } from "@/components/WatchlistControls";

export default async function WatchlistPage() {
  const entries = await getWatchlist();

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-warm-gray">
          Your watchlist is empty. Search for something to add.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-display text-2xl font-semibold text-ink">
        My watchlist
      </h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {entries.map((entry) => (
          <AnimeTicket
            key={entry.id}
            href={`/anime/${entry.anime.jikan_id}`}
            title={entry.anime.title}
            imageUrl={entry.anime.image_url}
            status={entry.status}
            episodeLabel={`${entry.episodes_watched}${entry.anime.episodes ? `/${entry.anime.episodes}` : ""}`}
          >
            <WatchlistControls
              entryId={entry.id}
              initialCount={entry.episodes_watched}
              initialStatus={entry.status}
              initialScore={entry.score}
              totalEpisodes={entry.anime.episodes}
            />
          </AnimeTicket>
        ))}
      </div>
    </div>
  );
}
