import { apiFetch } from "./client";
import { WatchlistEntry } from "@/types/watchlist";

export function getWatchlist() {
  return apiFetch<WatchlistEntry[]>("/watchlist");
}
