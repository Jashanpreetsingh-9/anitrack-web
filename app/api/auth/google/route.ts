import { NextResponse } from "next/server";
import { beginOAuth } from "@/lib/oauth-start";

export async function GET(request: Request) {
  const { origin, state } = await beginOAuth(request);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: `${origin}/api/auth/callback/google`,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
