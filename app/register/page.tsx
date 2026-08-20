import { OAuthButtons, AuthSwitchLink } from "@/components/AuthPanel";
import { AuthShell } from "@/components/AuthShell";
import { authPageError } from "@/lib/auth-errors";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = authPageError(error, "register");

  return (
    <AuthShell
      eyebrow="Register"
      title="Create an account"
      description="New users start here. Sign up with Google or GitHub, then you'll choose a username and password for AniTrack."
    >
      <div className="space-y-6">
        <ol className="space-y-1 font-body text-sm text-ink/75">
          <li>
            <span className="font-mono text-[10px] uppercase tracking-wide text-warm-gray">
              1.{" "}
            </span>
            Sign up with Google or GitHub
          </li>
          <li>
            <span className="font-mono text-[10px] uppercase tracking-wide text-warm-gray">
              2.{" "}
            </span>
            Pick a username and password on the next screen
          </li>
        </ol>
        {initialError && (
          <p className="font-mono text-xs text-stub" role="alert">
            {initialError}
          </p>
        )}
        <OAuthButtons intent="register" />
        <AuthSwitchLink mode="register" />
      </div>
    </AuthShell>
  );
}
