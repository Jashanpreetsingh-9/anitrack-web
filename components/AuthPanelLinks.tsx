import Link from "next/link";

export function AuthSwitchLink({
  mode,
}: {
  mode: "login" | "register";
}) {
  if (mode === "login") {
    return (
      <p className="text-center font-mono text-xs text-warm-gray">
        No account?{" "}
        <Link
          href="/register"
          className="text-ink underline focus-visible:ring-2 focus-visible:ring-ink"
        >
          Sign up
        </Link>
      </p>
    );
  }

  return (
    <p className="text-center font-mono text-xs text-warm-gray">
      Already have an account?{" "}
      <Link
        href="/login"
        className="text-ink underline focus-visible:ring-2 focus-visible:ring-ink"
      >
        Log in
      </Link>
    </p>
  );
}
