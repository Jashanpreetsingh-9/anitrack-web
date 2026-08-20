import Link from "next/link";
import { DesktopNav, MobileNav, type NavLink } from "@/components/MobileNav";

const siteLinks: NavLink[] = [
  { href: "/explore", label: "Explore" },
  { href: "/register", label: "Sign up", primary: true },
  { href: "/login", label: "Log in" },
];

export function SiteHeader() {
  return (
    <header className="relative border-b border-warm-gray px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-sm font-semibold text-ink focus-visible:ring-2 focus-visible:ring-ink"
        >
          AniTrack
        </Link>
        <DesktopNav links={siteLinks} />
        <MobileNav links={siteLinks} />
      </div>
    </header>
  );
}
