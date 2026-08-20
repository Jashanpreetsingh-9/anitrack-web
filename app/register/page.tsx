import { OAuthButtons, AuthSwitchLink } from "@/components/AuthPanel";
import { AuthShell } from "@/components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Sign up with Google or GitHub, then choose your username and password."
    >
      <div className="space-y-6">
        <OAuthButtons label="sign up" />
        <AuthSwitchLink mode="register" />
      </div>
    </AuthShell>
  );
}
