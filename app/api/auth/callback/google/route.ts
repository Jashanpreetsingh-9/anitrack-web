import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  exchangeOAuthIdentity,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/oauth";
import { fetchAuthUser, postLoginPath } from "@/lib/auth-session";

type GoogleTokenResponse = { access_token?: string };
type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean | string;
  name?: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || !storedState || state !== storedState) {
    console.error("[oauth/google] state mismatch", {
      code: !!code,
      state,
      storedState,
    });
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        code,
        redirect_uri: `${origin}/api/auth/callback/google`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) {
      console.error(
        "[oauth/google] token exchange failed",
        tokenResponse.status,
        await tokenResponse.text(),
      );
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }
    const tokenData: GoogleTokenResponse = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error("[oauth/google] no access_token in response", tokenData);
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
    );
    if (!userInfoResponse.ok) {
      console.error(
        "[oauth/google] userinfo fetch failed",
        userInfoResponse.status,
      );
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }
    const userInfo: GoogleUserInfo = await userInfoResponse.json();
    const isVerified =
      userInfo.email_verified === true || userInfo.email_verified === "true";
    if (!userInfo.email || !isVerified) {
      console.error("[oauth/google] email missing or unverified", userInfo);
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    const sessionToken = await exchangeOAuthIdentity({
      email: userInfo.email,
      name: userInfo.name ?? userInfo.email,
      provider: "google",
    });
    if (!sessionToken) {
      console.error("[oauth/google] exchangeOAuthIdentity returned falsy");
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });

    const user = await fetchAuthUser(sessionToken);
    const redirectPath = user ? postLoginPath(user) : "/watchlist";
    return NextResponse.redirect(`${origin}${redirectPath}`);
  } catch (err) {
    console.error("[oauth/google] unexpected error", err);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }
}
