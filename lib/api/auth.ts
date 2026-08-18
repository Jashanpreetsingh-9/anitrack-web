const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}
