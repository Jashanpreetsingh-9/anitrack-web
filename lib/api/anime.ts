import { apiFetch } from "./client";
import { Anime } from "@/types/anime";

export function getAnimeDetail(jikanId: number) {
  return apiFetch<Anime>(`/anime/mal/${jikanId}`, {
    revalidate: 3600,
    public: true,
  });
}

export function getExploreAnime(params?: {
  genre?: string;
  season?: string;
  is_airing?: boolean;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.genre) query.set("genre", params.genre);
  if (params?.season) query.set("season", params.season);
  if (params?.is_airing !== undefined)
    query.set("is_airing", String(params.is_airing));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<Anime[]>(`/anime/explore${qs ? `?${qs}` : ""}`, {
    revalidate: 3600,
    public: true,
  });
}
