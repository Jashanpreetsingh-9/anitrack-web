import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  exchangeOAuthIdentityResult,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/oauth";
import { fetchAuthUser, postLoginPath } from "@/lib/auth-session";

type GitHubTokenResponse = { access_token?: string; error?: string };
type GitHubUser = {
  name?: string | null;
  login?: string;
  email?: string | null;
};
type GitHubEmail = { email: string; primary: boolean; verified: boolean };

function resolveGitHubEmail(
  user: GitHubUser,
  emails: GitHubEmail[],
): string | null {
  const fromList =
    emails.find((entry) => entry.primary && entry.verified)?.email ??
    emails.find((entry) => entry.verified)?.email;

  return fromList ?? user.email ?? null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    console.error("[oauth/github] provider returned error", oauthError);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || !storedState || state !== storedState) {
    console.error("[oauth/github] state mismatch", {
      code: !!code,
      state,
      storedState,
    });
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
      console.error(
        "[oauth/github] token exchange failed",
        tokenResponse.status,
        await tokenResponse.text(),
      );
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const tokenData: GitHubTokenResponse = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error("[oauth/github] no access_token in response", tokenData);
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
      console.error("[oauth/github] profile fetch failed", {
        userStatus: userResponse.status,
        emailsStatus: emailsResponse.status,
      });
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const user: GitHubUser = await userResponse.json();
    const emails: GitHubEmail[] = await emailsResponse.json();
    const email = resolveGitHubEmail(user, emails);

    if (!email) {
      console.error("[oauth/github] no verified email found", {
        login: user.login,
        emailCount: emails.length,
      });
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const oauthResult = await exchangeOAuthIdentityResult({
      email,
      name: user.name ?? user.login ?? email,
      provider: "github",
    });
    const sessionToken = oauthResult.token;

    if (!sessionToken) {
      console.error("[oauth/github] exchangeOAuthIdentity returned falsy");
      const errorParam =
        oauthResult.status === 409 ? "oauth_conflict" : "oauth_failed";
      return NextResponse.redirect(`${origin}/login?error=${errorParam}`);
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
  } catch (err) {
    console.error("[oauth/github] unexpected error", err);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }
}
