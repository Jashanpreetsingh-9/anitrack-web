import { apiFetch } from "@/lib/api/client";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  await apiFetch(`/watchlist/${id}`, {
    method: "PATCH",
    body,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;

  await apiFetch(`/watchlist/${id}`, { method: "DELETE" });

  return NextResponse.json({ success: true });
}
