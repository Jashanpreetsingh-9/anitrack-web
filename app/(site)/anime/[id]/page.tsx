import { getAnimeDetail } from "@/lib/api/anime";
import type { Metadata } from "next";
import type { Genre } from "@/types/anime";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeDetail(Number(id));

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
  const anime = await getAnimeDetail(Number(id));

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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flow-root rounded-sm border border-warm-gray bg-paper p-6 shadow-sm">
        {anime.image_url && (
          <img
            src={anime.image_url}
            alt={anime.title}
            className="float-left mr-6 mb-4 w-44 rounded-sm object-contain"
          />
        )}

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
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
