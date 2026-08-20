import { LoginForm } from "@/components/LoginForm";
import { AuthShell } from "@/components/AuthShell";
import { authPageError } from "@/lib/auth-errors";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = authPageError(error, "login");

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
