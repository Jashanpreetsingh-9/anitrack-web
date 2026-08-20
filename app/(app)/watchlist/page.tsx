import { getWatchlist } from "@/lib/api/watchlist";
import { AnimeTicket } from "@/components/AnimeTicket";
import { WatchlistControls } from "@/components/WatchlistControls";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function WatchlistPage() {
  const entries = await getWatchlist();

  return (
    <PageContainer width="md">
      <PageHeader
        title="My watchlist"
        description="Track episodes, status, and ratings for everything you're watching."
      />

      {entries.length === 0 ? (
        <EmptyState
          message="Your watchlist is empty."
          actionLabel="Search anime"
          actionHref="/search"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry) => (
            <AnimeTicket
              key={entry.id}
              href={`/anime/${entry.anime.mal_id}`}
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
      )}
    </PageContainer>
  );
}
