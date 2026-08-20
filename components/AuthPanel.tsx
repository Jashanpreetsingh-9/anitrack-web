import { OAuthLink } from "@/components/ui/Button";

export function OAuthButtons({ label }: { label: "sign in" | "sign up" }) {
  const verb = label === "sign up" ? "Sign up" : "Continue";

  return (
    <div className="space-y-2">
      <OAuthLink href="/api/auth/google">{verb} with Google</OAuthLink>
      <OAuthLink href="/api/auth/github">{verb} with GitHub</OAuthLink>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-warm-gray" />
      <span className="font-mono text-[10px] uppercase tracking-wide text-warm-gray">
        Or
      </span>
      <div className="h-px flex-1 bg-warm-gray" />
    </div>
  );
}

export { AuthSwitchLink } from "./AuthPanelLinks";
