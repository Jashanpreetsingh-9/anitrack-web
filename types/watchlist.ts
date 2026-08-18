import { Anime } from "./anime";

export type WatchStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "dropped";

export type WatchlistEntry = {
  id: number;
  anime: Anime;
  status: WatchStatus;
  episodes_watched: number;
  score: number | null;
  created_at: string;
};
