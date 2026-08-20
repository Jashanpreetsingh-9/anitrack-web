import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";

const features = [
  {
    title: "Track your watchlist",
    description:
      "Log episodes, set status, and rate shows — all in one place with a ticket-stub layout you'll actually enjoy using.",
  },
  {
    title: "Discover anime",
    description:
      "Browse top-rated titles and what's airing now. Search the catalog and add anything to your list in a tap.",
  },
  {
    title: "Get recommendations",
    description:
      "Personalized picks based on what you've watched. Find your next binge without scrolling endlessly.",
  },
];

export default function HomePage() {
  return (
    <>
      <PageContainer width="lg" className="py-16 sm:py-24">
        <section className="mx-auto max-w-2xl text-center">
          <Image
            src="/favicon.png"
            alt="AniTrack"
            width={80}
            height={80}
            priority
            className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
          />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-stub">
            Built for anime fans
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
            Track what you watch.
            <br />
            <span className="text-sage">Find what&apos;s next.</span>
          </h1>
          <p className="mt-4 font-body text-base text-ink/70 sm:text-lg">
            AniTrack is your paper-ticket watchlist — log episodes, explore
            titles, and get recommendations tailored to your taste.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/register">Sign up</Button>
            <Button variant="secondary" href="/explore">
              Explore anime
            </Button>
          </div>
        </section>

        <div className="ticket-divider my-14" aria-hidden="true" />

        <section>
          <h2 className="mb-6 text-center font-display text-xl font-semibold text-ink">
            Everything you need
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </PageContainer>

      <footer className="border-t border-warm-gray px-4 py-8 sm:px-6">
        <PageContainer width="lg" className="py-0">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href="/explore"
              className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
            >
              Sign up
            </Link>
          </nav>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wide text-warm-gray">
            AniTrack
          </p>
        </PageContainer>
      </footer>
    </>
  );
}
