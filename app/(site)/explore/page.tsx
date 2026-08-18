import { getExploreAnime } from "@/lib/api/anime";
import type { Metadata } from "next";
import type { Anime } from "@/types/anime";
import { AnimeTicket } from "@/components/AnimeTicket";

export const metadata: Metadata = {
  title: "Explore — AniTrack",
  description: "Browse top-rated and currently airing anime.",
};

function AnimeGrid({ anime }: { anime: Anime[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {anime.map((item) => (
        <AnimeTicket
          key={item.id}
          href={`/anime/${item.jikan_id}`}
          title={item.title}
          imageUrl={item.image_url}
          score={item.score}
          rank={item.rank}
        />
      ))}
    </div>
  );
}

export default async function ExplorePage() {
  const [topRated, airingNow] = await Promise.all([
    getExploreAnime(),
    getExploreAnime({ is_airing: true }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 font-display text-2xl font-semibold text-ink">
        Explore
      </h1>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Top Rated
        </h2>
        <AnimeGrid anime={topRated} />
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Airing Now
        </h2>
        <AnimeGrid anime={airingNow} />
      </section>
    </div>
  );
}
