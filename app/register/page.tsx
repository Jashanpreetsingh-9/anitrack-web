import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-sm border border-warm-gray bg-paper p-8 shadow-sm">
        <h1 className="font-display text-xl font-semibold text-ink">
          Create an account
        </h1>

        <p className="font-body text-sm text-warm-gray">
          Registration is only available with Google or GitHub.
        </p>

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
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
