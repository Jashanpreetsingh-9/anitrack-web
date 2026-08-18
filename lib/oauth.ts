import { randomBytes } from "crypto";

export const OAUTH_STATE_COOKIE = "oauth_state";
export const OAUTH_STATE_MAX_AGE = 60 * 5;
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function generateOAuthState(): string {
  return randomBytes(16).toString("hex");
}

export type OAuthIdentity = {
  email: string;
  name: string;
  provider: "google" | "github";
};

export async function exchangeOAuthIdentity(
  identity: OAuthIdentity,
): Promise<string | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Auth-Secret": process.env.INTERNAL_AUTH_SECRET ?? "",
      },
      body: JSON.stringify(identity),
    },
  );

  if (!response.ok) {
    console.error(
      "[exchangeOAuthIdentity] backend rejected",
      response.status,
      await response.text(),
    );
    return null;
  }

  const data: { access_token?: string } = await response.json();
  return data.access_token ?? null;
}
