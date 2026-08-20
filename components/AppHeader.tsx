import Link from "next/link";
import { DesktopNav, MobileNav, type NavLink } from "@/components/MobileNav";

const appLinks: NavLink[] = [
  { href: "/watchlist", label: "Watchlist" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/recommendations", label: "Recommendations" },
];

export function AppHeader() {
  return (
    <header className="relative border-b border-warm-gray px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/watchlist"
          className="font-display text-sm font-semibold text-ink focus-visible:ring-2 focus-visible:ring-ink"
        >
          AniTrack
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <DesktopNav links={appLinks} />
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-wide text-warm-gray hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
            >
              Log out
            </button>
          </form>
        </div>
        <MobileNav
          links={[
            ...appLinks,
            { href: "/api/auth/logout", label: "Log out", action: "logout" },
          ]}
        />
      </div>
    </header>
  );
}
