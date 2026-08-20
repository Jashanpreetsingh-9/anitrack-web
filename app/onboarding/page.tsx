import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { OnboardingForm } from "@/components/OnboardingForm";
import { apiFetch } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth-session";

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    redirect("/login");
  }

  let user: AuthUser;
  try {
    user = await apiFetch<AuthUser>("/auth/me");
  } catch {
    redirect("/login");
  }

  if (user.profile_complete) {
    redirect("/watchlist");
  }

  return (
    <AuthShell
      title="Finish setting up"
      description="Choose a username and password. You can still sign in with Google or GitHub anytime."
    >
      <OnboardingForm suggestedUsername={user.username} />
    </AuthShell>
  );
}
