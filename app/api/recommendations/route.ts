import { apiFetchForRoute, isRouteError } from "@/lib/api/client";
import { NextResponse } from "next/server";
import { AnimeSearchResult } from "@/types/anime";
import type { Recommendation, ResolvedRecommendation } from "@/types/api";

export async function GET() {
  const recommendations = await apiFetchForRoute<Recommendation[]>(
    "/recommendations",
  );
  if (isRouteError(recommendations)) return recommendations;

  const resolved: ResolvedRecommendation[] = await Promise.all(
    recommendations.map(async (rec) => {
      try {
        const searchResult = await apiFetchForRoute<AnimeSearchResult[]>(
          `/anime/search?q=${encodeURIComponent(rec.title)}&limit=1`,
        );
        if (isRouteError(searchResult)) {
          return { ...rec, mal_id: null };
        }
        return { ...rec, mal_id: searchResult[0]?.mal_id ?? null };
      } catch {
        return { ...rec, mal_id: null };
      }
    }),
  );

  return NextResponse.json(resolved);
}
