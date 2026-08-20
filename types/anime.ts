export type Genre = {
  id: number;
  name: string;
  category: "genre" | "theme" | "demographic";
};

export type StreamingLink = {
  name: string;
  url: string;
};

export type Anime = {
  id: number;
  mal_id: number;
  title: string;
  synopsis: string | null;
  image_url: string | null;
  episodes: number | null;
  is_airing: boolean;
  author: string | null;
  score: number | null;
  rank: number | null;
  popularity: number | null;
  season: string | null;
  year: number | null;
  type: string | null;
  duration: string | null;
  rating: string | null;
  trailer_youtube_id: string | null;
  trailer_embed_url: string | null;
  streaming_links: StreamingLink[] | null;
  genres: Genre[];
};

export type AnimeSearchResult = {
  mal_id: number;
  title: string;
  synopsis: string | null;
  image_url: string | null;
  episodes: number | null;
  is_airing: boolean;
};
