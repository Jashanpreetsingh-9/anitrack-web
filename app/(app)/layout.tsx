import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <nav className="flex items-center gap-6 border-b border-warm-gray px-6 py-4">
        <Link
          href="/watchlist"
          className="font-display text-sm font-semibold text-ink"
        >
          AniTrack
        </Link>
        <Link
          href="/watchlist"
          className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub"
        >
          Watchlist
        </Link>
        <Link
          href="/explore"
          className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub"
        >
          Explore
        </Link>
        <Link
          href="/search"
          className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub"
        >
          Search
        </Link>
        <Link
          href="/recommendations"
          className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub"
        >
          Recommendations
        </Link>
        <form action="/api/auth/logout" method="POST" className="ml-auto">
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-wide text-warm-gray hover:text-stub"
          >
            Log out
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
