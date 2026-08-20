import { NextResponse } from "next/server";
import { beginOAuth } from "@/lib/oauth-start";

export async function GET(request: Request) {
  const { origin, state } = await beginOAuth(request);

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
