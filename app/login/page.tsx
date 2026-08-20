import { LoginForm } from "@/components/LoginForm";
import { AuthShell } from "@/components/AuthShell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError =
    error === "oauth_conflict"
      ? "This email is already registered with Google. Log in with Google instead."
      : error === "oauth_failed"
        ? "Something went wrong signing in. Please try again."
        : null;

  return (
    <AuthShell
      eyebrow="Log in"
      title="Welcome back"
      description="Already have an account? Log in with your username and password, or the Google or GitHub account you used to register."
    >
      <LoginForm initialError={initialError} />
    </AuthShell>
  );
}
