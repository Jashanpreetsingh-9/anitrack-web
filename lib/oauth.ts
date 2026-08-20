import { randomBytes } from "crypto";

import { getServerEnv } from "@/lib/env";

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

export type OAuthExchangeResult = {
  token: string | null;
  status: number;
  detail: string | null;
};

export async function exchangeOAuthIdentity(
  identity: OAuthIdentity,
): Promise<string | null> {
  const result = await exchangeOAuthIdentityResult(identity);
  return result.token;
}

export async function exchangeOAuthIdentityResult(
  identity: OAuthIdentity,
): Promise<OAuthExchangeResult> {
  const { apiUrl, internalAuthSecret } = getServerEnv();
  const response = await fetch(`${apiUrl}/auth/oauth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Auth-Secret": internalAuthSecret,
    },
    body: JSON.stringify(identity),
  });

  const text = await response.text();
  let detail: string | null = null;
  let accessToken: string | undefined;
  try {
    const data = JSON.parse(text) as { access_token?: string; detail?: unknown };
    accessToken = data.access_token;
    if (typeof data.detail === "string") detail = data.detail;
  } catch {
    detail = text || null;
  }

  if (!response.ok) {
    console.error(
      "[exchangeOAuthIdentity] backend rejected",
      response.status,
      text,
    );
    return { token: null, status: response.status, detail };
  }

  return {
    token: accessToken ?? null,
    status: response.status,
    detail,
  };
}
