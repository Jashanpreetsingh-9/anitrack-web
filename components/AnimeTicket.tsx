import Link from "next/link";

type AnimeTicketProps = {
  href: string;
  title: string;
  imageUrl: string | null;
  score?: number | null;
  rank?: number | null;
  status?: string; // "watching" | "completed" | etc, for a stamp
  episodeLabel?: string; // e.g. "12 / 24"
  children?: React.ReactNode; // for slotting in mutation controls (stepper, add button)
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
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-warm-gray bg-paper shadow-sm transition-transform hover:-translate-y-0.5">
      {status && (
        <span className="absolute right-2 top-2 z-10 -rotate-6 rounded-sm border border-ink/20 bg-paper/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink">
          {status.replace(/_/g, " ")}
        </span>
      )}

      <Link href={href} className="block">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="aspect-[2/3] w-full object-cover"
          />
        )}
      </Link>

      {/* perforated tear line */}
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
          className="font-display text-sm font-semibold leading-snug group-hover:underline"
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
