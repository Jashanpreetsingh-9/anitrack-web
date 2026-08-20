import { getExploreAnime } from "@/lib/api/anime";
import { AnimeGrid } from "@/components/AnimeGrid";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader, SectionTitle } from "@/components/ui/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore — AniTrack",
  description: "Browse top-rated and currently airing anime.",
};

export default async function ExplorePage() {
  const [topRated, airingNow] = await Promise.all([
    getExploreAnime(),
    getExploreAnime({ is_airing: true }),
  ]);

  return (
    <PageContainer width="lg">
      <PageHeader
        title="Explore"
        description="Browse top-rated titles and what's airing now."
      />

      <section className="mb-12">
        <SectionTitle>Top Rated</SectionTitle>
        <AnimeGrid anime={topRated} />
      </section>

      <section>
        <SectionTitle>Airing Now</SectionTitle>
        <AnimeGrid anime={airingNow} />
      </section>
    </PageContainer>
  );
}
