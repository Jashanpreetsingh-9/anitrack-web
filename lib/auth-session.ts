const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  profile_complete: boolean;
};

export async function fetchAuthUser(
  sessionToken: string,
): Promise<AuthUser | null> {
  if (!API_URL) return null;

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
    cache: "no-store",
  });

  if (!response.ok) return null;
  return response.json();
}

export function postLoginPath(user: AuthUser): string {
  return user.profile_complete ? "/watchlist" : "/onboarding";
}
