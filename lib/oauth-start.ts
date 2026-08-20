import { cookies } from "next/headers";
import {
  generateOAuthState,
  OAUTH_INTENT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE,
  parseOAuthIntent,
  type OAuthIntent,
} from "@/lib/oauth";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: OAUTH_STATE_MAX_AGE,
  path: "/",
};

export async function beginOAuth(request: Request): Promise<{
  origin: string;
  state: string;
  intent: OAuthIntent;
}> {
  const url = new URL(request.url);
  const intent = parseOAuthIntent(url.searchParams.get("intent"));
  const state = generateOAuthState();

  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, cookieOptions);
  cookieStore.set(OAUTH_INTENT_COOKIE, intent, cookieOptions);

  return { origin: url.origin, state, intent };
}
