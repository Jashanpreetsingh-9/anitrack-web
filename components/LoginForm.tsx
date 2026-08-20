"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthDivider,
  AuthSwitchLink,
  OAuthButtons,
} from "@/components/AuthPanel";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Invalid username or password");
      return;
    }

    const data: { redirectTo?: string } = await response.json();
    router.push(data.redirectTo ?? "/watchlist");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Username or email" htmlFor="username">
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        {error && (
          <p className="font-mono text-xs text-stub" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <AuthDivider />
      <p className="text-center font-mono text-[10px] uppercase tracking-wide text-warm-gray">
        Or log in with a provider
      </p>
      <OAuthButtons intent="login" />
      <AuthSwitchLink mode="login" />
    </div>
  );
}
