import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { apiFetch } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth-session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: AuthUser;
  try {
    user = await apiFetch<AuthUser>("/auth/me");
  } catch {
    redirect("/login");
  }

  if (!user.profile_complete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-paper"
      >
        Skip to content
      </a>
      <AppHeader />
      <main id="main">{children}</main>
    </div>
  );
}
