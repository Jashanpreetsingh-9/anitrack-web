import Link from "next/link";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-warm-gray px-6 py-4">
        <Link href="/" className="font-display text-sm font-semibold text-ink">
          AniTrack
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/explore"
            className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub"
          >
            Explore
          </Link>
          <Link
            href="/login"
            className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-sm border border-ink bg-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-stub hover:border-stub"
          >
            Get started
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
