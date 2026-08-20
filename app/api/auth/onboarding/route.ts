import { apiFetchForRoute, isRouteError } from "@/lib/api/client";
import { NextResponse } from "next/server";

type OnboardingBody = {
  username: string;
  password: string;
};

export async function POST(request: Request) {
  const body: OnboardingBody = await request.json();

  const result = await apiFetchForRoute("/auth/onboarding", {
    method: "POST",
    body,
  });
  if (isRouteError(result)) return result;

  return NextResponse.json({ success: true, user: result });
}
