export function authPageError(
  error: string | undefined,
  page: "login" | "register",
): string | null {
  if (page === "login") {
    if (error === "oauth_missing") {
      return "No account for this email. Create an account first.";
    }
    if (error === "oauth_failed") {
      return "Something went wrong logging in. Please try again.";
    }
    return null;
  }

  if (error === "oauth_exists") {
    return "An account already exists for this email. Log in instead.";
  }
  if (error === "oauth_failed") {
    return "Something went wrong creating your account. Please try again.";
  }
  return null;
}
