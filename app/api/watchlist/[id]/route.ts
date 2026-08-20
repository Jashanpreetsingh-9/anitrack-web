import { apiFetchForRoute, isRouteError } from "@/lib/api/client";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const result = await apiFetchForRoute(`/watchlist/${id}`, {
    method: "PATCH",
    body,
  });
  if (isRouteError(result)) return result;

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;

  const result = await apiFetchForRoute(`/watchlist/${id}`, {
    method: "DELETE",
  });
  if (isRouteError(result)) return result;

  return NextResponse.json({ success: true });
}
