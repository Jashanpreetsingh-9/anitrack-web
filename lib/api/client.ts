import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  revalidate?: number | false;
  /** Public pages should not send the user to /login if the API returns 401. */
  public?: boolean;
};

async function parseErrorDetail(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const json = JSON.parse(text) as { detail?: string | unknown };
    if (typeof json.detail === "string") return json.detail;
    if (json.detail !== undefined) return JSON.stringify(json.detail);
  } catch {
    // not JSON
  }
  return text || response.statusText;
}

async function fetchFromApi(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const cacheOption =
    options.revalidate !== undefined
      ? { next: { revalidate: options.revalidate } }
      : { cache: "no-store" as const };

  return fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    ...cacheOption,
  });
}

/** For Server Components — redirects to /login on 401. */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetchFromApi(path, options);

  if (response.status === 401) {
    if (options.public) {
      throw new ApiError(401, await parseErrorDetail(response));
    }
    redirect("/login");
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response));
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

/** For Route Handlers — returns NextResponse on 401 instead of redirecting. */
export async function apiFetchForRoute<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T | NextResponse> {
  const response = await fetchFromApi(path, options);

  if (response.status === 401) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  if (!response.ok) {
    const detail = await parseErrorDetail(response);
    return NextResponse.json({ detail }, { status: response.status });
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export function isRouteError<T>(
  result: T | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
