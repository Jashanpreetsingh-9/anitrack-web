import { OAuthButtons, AuthSwitchLink } from "@/components/AuthPanel";
import { AuthShell } from "@/components/AuthShell";

export default function RegisterPage() {
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
        <OAuthButtons label="sign up" />
        <AuthSwitchLink mode="register" />
      </div>
    </AuthShell>
  );
}
