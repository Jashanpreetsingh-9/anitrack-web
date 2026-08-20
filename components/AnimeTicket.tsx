import Link from "next/link";
import Image from "next/image";
import type { WatchStatus } from "@/types/watchlist";

type AnimeTicketProps = {
  href: string;
  title: string;
  imageUrl: string | null;
  score?: number | null;
  rank?: number | null;
  status?: WatchStatus;
  episodeLabel?: string;
  children?: React.ReactNode;
};

export function AnimeTicket({
  href,
  title,
  imageUrl,
  score,
  rank,
  status,
  episodeLabel,
  children,
}: AnimeTicketProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-warm-gray bg-paper shadow-sm transition-shadow hover:shadow-md">
      {status && (
        <span
          className={`absolute right-2 top-2 z-10 -rotate-6 rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
            status === "watching"
              ? "border-stub/40 bg-paper/90 text-stub"
              : "border-ink/20 bg-paper/90 text-ink"
          }`}
        >
          {status.replace(/_/g, " ")}
        </span>
      )}

      <Link href={href} className="block">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={300}
            height={450}
            className="aspect-[2/3] w-full object-cover"
            loading="lazy"
          />
        )}
      </Link>

      <div
        className="h-3 w-full bg-paper"
        style={{
          maskImage:
            "radial-gradient(circle at 6px 0, transparent 4px, black 4.5px)",
          maskSize: "12px 12px",
          maskRepeat: "repeat-x",
          maskPosition: "0 -6px",
          backgroundColor: "var(--color-warm-gray)",
        }}
      />

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          href={href}
          className="font-display text-sm font-semibold leading-snug group-hover:underline focus-visible:ring-2 focus-visible:ring-ink"
        >
          {title}
        </Link>
        <p className="font-mono text-xs text-warm-gray">
          {score ? `${score.toFixed(2)}★` : ""}
          {rank ? ` NO.${String(rank).padStart(3, "0")}` : ""}
          {episodeLabel ? ` · EP ${episodeLabel}` : ""}
        </p>
        {children}
      </div>
    </div>
  );
}
