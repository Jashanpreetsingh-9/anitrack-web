import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { login } from "@/lib/api/auth";
import { fetchAuthUser, postLoginPath } from "@/lib/auth-session";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { access_token } = await login(body);

    const cookieStore = await cookies();
    cookieStore.set("session", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const user = await fetchAuthUser(access_token);
    const redirectTo = user ? postLoginPath(user) : "/watchlist";

    return NextResponse.json({ success: true, redirectTo });
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
