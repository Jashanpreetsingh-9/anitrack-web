import { apiFetch } from "@/lib/api/client";
import { NextResponse } from "next/server";
import { Anime } from "@/types/anime";

export async function POST(request: Request) {
  const { jikan_id } = await request.json();

  const anime = await apiFetch<Anime>("/anime", {
    method: "POST",
    body: { jikan_id },
  });

  await apiFetch("/watchlist", {
    method: "POST",
    body: { anime_id: anime.id },
  });

  return NextResponse.json({ success: true });
}
