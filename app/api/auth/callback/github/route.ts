import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  exchangeOAuthIdentity,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/oauth";
import { fetchAuthUser, postLoginPath } from "@/lib/auth-session";

type GitHubTokenResponse = { access_token?: string; error?: string };
type GitHubUser = { name?: string | null; login?: string };
type GitHubEmail = { email: string; primary: boolean; verified: boolean };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID ?? "",
          client_secret: process.env.GITHUB_CLIENT_SECRET ?? "",
          code,
          redirect_uri: `${origin}/api/auth/callback/github`,
        }),
      },
    );

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const tokenData: GitHubTokenResponse = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const [userResponse, emailsResponse] = await Promise.all([
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github+json",
        },
      }),
      fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github+json",
        },
      }),
    ]);

    if (!userResponse.ok || !emailsResponse.ok) {
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const user: GitHubUser = await userResponse.json();
    const emails: GitHubEmail[] = await emailsResponse.json();
    const primaryEmail = emails.find((e) => e.primary && e.verified);

    if (!primaryEmail) {
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const sessionToken = await exchangeOAuthIdentity({
      email: primaryEmail.email,
      name: user.name ?? user.login ?? primaryEmail.email,
      provider: "github",
    });

    if (!sessionToken) {
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });

    const authUser = await fetchAuthUser(sessionToken);
    const redirectPath = authUser ? postLoginPath(authUser) : "/watchlist";
    return NextResponse.redirect(`${origin}${redirectPath}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }
}
