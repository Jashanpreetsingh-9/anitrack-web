import { AnimeTicket } from "@/components/AnimeTicket";
import type { Anime } from "@/types/anime";
import { EmptyState } from "@/components/ui/EmptyState";

export function AnimeGrid({ anime }: { anime: Anime[] }) {
  if (anime.length === 0) {
    return <EmptyState message="Nothing here yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {anime.map((item) => (
        <AnimeTicket
          key={item.id}
          href={`/anime/${item.mal_id}`}
          title={item.title}
          imageUrl={item.image_url}
          score={item.score}
          rank={item.rank}
        />
      ))}
    </div>
  );
}
