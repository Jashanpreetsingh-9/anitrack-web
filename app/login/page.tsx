import { LoginForm } from "@/components/LoginForm";
import { AuthShell } from "@/components/AuthShell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError =
    error === "oauth_failed"
      ? "Something went wrong signing in. Please try again."
      : null;

  return (
    <AuthShell
      title="Log in"
      description="Use your username or email and password, or continue with Google or GitHub."
    >
      <LoginForm initialError={initialError} />
    </AuthShell>
  );
}
