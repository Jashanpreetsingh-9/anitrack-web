import Link from "next/link";
import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function AuthShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-ink focus-visible:ring-2 focus-visible:ring-ink"
          >
            AniTrack
          </Link>
          {title && (
            <h1 className="mt-4 font-display text-xl font-semibold text-ink">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-2 font-body text-sm text-ink/70">{description}</p>
          )}
        </div>
        <Card>{children}</Card>
      </div>
    </div>
  );
}
