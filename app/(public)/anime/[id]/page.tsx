import { getAnimeDetail } from "@/lib/api/anime";
import { ApiError } from "@/lib/api/client";
import type { Metadata } from "next";
import type { Genre } from "@/types/anime";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";

type Props = {
  params: Promise<{ id: string }>;
};

async function loadAnime(idParam: string) {
  const jikanId = Number(idParam);
  if (!Number.isInteger(jikanId) || jikanId <= 0) {
    notFound();
  }

  try {
    return await getAnimeDetail(jikanId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const anime = await loadAnime(id);

  return {
    title: `${anime.title} — AniTrack`,
    description:
      anime.synopsis?.slice(0, 155) ?? `Track ${anime.title} on AniTrack.`,
  };
}

function TagGroup({ label, tags }: { label: string; tags: Genre[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase tracking-wide text-warm-gray">
        {label}
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {tags.map((g) => (
          <span
            key={g.id}
            className="rounded-sm border border-sage px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-sage"
          >
            {g.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  const anime = await loadAnime(id);

  const genreTags = anime.genres.filter((g) => g.category === "genre");
  const themeTags = anime.genres.filter((g) => g.category === "theme");
  const demographicTags = anime.genres.filter(
    (g) => g.category === "demographic",
  );

  const infoLine = [
    anime.type,
    anime.is_airing ? "Airing" : "Finished",
    anime.episodes ? `${anime.episodes} EP` : null,
    anime.duration,
    anime.score ? `${anime.score.toFixed(2)}★` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const hasStreamingLinks =
    anime.streaming_links !== null && anime.streaming_links.length > 0;

  return (
    <PageContainer width="md">
      <Card>
        <div className="flex flex-col gap-6 md:flex-row">
          {anime.image_url && (
            <Image
              src={anime.image_url}
              alt={anime.title}
              width={176}
              height={264}
              className="mx-auto w-44 shrink-0 rounded-sm object-contain md:mx-0"
            />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold text-ink">
              {anime.title}
            </h1>
            {infoLine && (
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-warm-gray">
                {infoLine}
              </p>
            )}
            {anime.rating && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-warm-gray">
                {anime.rating}
              </p>
            )}

            <TagGroup label="Genres" tags={genreTags} />
            <TagGroup label="Themes" tags={themeTags} />
            <TagGroup label="Demographic" tags={demographicTags} />

            {anime.synopsis && (
              <p className="mt-4 font-body text-sm leading-relaxed text-ink">
                {anime.synopsis}
              </p>
            )}
          </div>
        </div>
      </Card>

      {anime.trailer_embed_url && (
        <div className="mt-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-warm-gray">
            Trailer
          </h2>
          <div className="mt-2 aspect-video overflow-hidden rounded-sm border border-warm-gray">
            <iframe
              src={anime.trailer_embed_url}
              title={`${anime.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      {hasStreamingLinks && (
        <div className="mt-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-warm-gray">
            Where to Watch
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {anime.streaming_links!.map((link) => (
              <Button
                key={link.name}
                variant="secondary"
                href={link.url}
                className="normal-case"
              >
                {link.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
