import { LoginForm } from "@/components/LoginForm";

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
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm initialError={initialError} />
    </div>
  );
}
