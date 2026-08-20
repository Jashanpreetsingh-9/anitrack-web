import { apiFetchForRoute, isRouteError } from "@/lib/api/client";
import { NextResponse } from "next/server";
import { Anime } from "@/types/anime";

export async function POST(request: Request) {
  const { mal_id } = await request.json();

  const anime = await apiFetchForRoute<Anime>("/anime", {
    method: "POST",
    body: { mal_id },
  });
  if (isRouteError(anime)) return anime;

  const result = await apiFetchForRoute("/watchlist", {
    method: "POST",
    body: { anime_id: anime.id },
  });
  if (isRouteError(result)) return result;

  return NextResponse.json({ success: true });
}
