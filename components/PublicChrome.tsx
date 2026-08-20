import { cookies } from "next/headers";
import { AppHeader } from "@/components/AppHeader";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchAuthUser } from "@/lib/auth-session";

export async function PublicChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("session")?.value;
  const user = token ? await fetchAuthUser(token) : null;
  const signedIn = Boolean(user?.profile_complete);

  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-paper"
      >
        Skip to content
      </a>
      {signedIn ? <AppHeader /> : <SiteHeader />}
      <main id="main">{children}</main>
    </div>
  );
}
