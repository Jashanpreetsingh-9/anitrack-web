"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Invalid username or password");
      return;
    }

    router.push("/watchlist");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-sm border border-warm-gray bg-paper p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="font-display text-xl font-semibold text-ink">Log in</h1>

        <div className="space-y-1">
          <label
            htmlFor="username"
            className="font-mono text-xs uppercase tracking-wide text-warm-gray"
          >
            Username or email
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-sm border border-warm-gray bg-paper px-3 py-2 font-body text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="font-mono text-xs uppercase tracking-wide text-warm-gray"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-sm border border-warm-gray bg-paper px-3 py-2 font-body text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>

        {error && <p className="font-mono text-xs text-stub">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm border border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-stub hover:border-stub disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-warm-gray" />
        <span className="font-mono text-[10px] uppercase tracking-wide text-warm-gray">
          Or
        </span>
        <div className="h-px flex-1 bg-warm-gray" />
      </div>

      <div className="space-y-2">
        <a
          href="/api/auth/google"
          className="block w-full rounded-sm border border-warm-gray px-3 py-2 text-center font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          Continue with Google
        </a>
        <a
          href="/api/auth/github"
          className="block w-full rounded-sm border border-warm-gray px-3 py-2 text-center font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          Continue with GitHub
        </a>
      </div>

      <p className="text-center font-mono text-xs text-warm-gray">
        No account?{" "}
        <Link href="/register" className="text-ink underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
