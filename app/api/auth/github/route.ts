import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  generateOAuthState,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE,
} from "@/lib/oauth";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const state = generateOAuthState();

  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: OAUTH_STATE_MAX_AGE,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID ?? "",
    redirect_uri: `${origin}/api/auth/callback/github`,
    scope: "read:user user:email",
    state,
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}
