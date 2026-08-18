import { apiFetch } from "@/lib/api/client";
import { NextResponse } from "next/server";
import { AnimeSearchResult } from "@/types/anime";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ data: [] });
  }

  const results = await apiFetch<AnimeSearchResult[]>(
    `/anime/search?q=${encodeURIComponent(q)}`,
  );

  return NextResponse.json(results);
}
