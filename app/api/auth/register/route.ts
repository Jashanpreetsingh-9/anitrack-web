import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const body = await request.json();

  const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!registerResponse.ok) {
    const status = registerResponse.status;
    const message =
      status === 409
        ? "That username or email is already taken"
        : "Registration failed";
    return NextResponse.json({ error: message }, { status });
  }

  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: body.username,
      password: body.password,
    }),
  });

  if (!loginResponse.ok) {
    return NextResponse.json(
      {
        error:
          "Account created, but automatic login failed. Please log in.",
      },
      { status: 502 },
    );
  }

  const { access_token } = await loginResponse.json();

  const cookieStore = await cookies();
  cookieStore.set("session", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
