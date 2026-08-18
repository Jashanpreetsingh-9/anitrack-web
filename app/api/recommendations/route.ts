import { apiFetch } from "@/lib/api/client";
import { NextResponse } from "next/server";

type Recommendation = { title: string; reason: string };

export async function GET() {
  const recommendations = await apiFetch<Recommendation[]>("/recommendations");
  return NextResponse.json(recommendations);
}
