"use client";

import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Redirect to WorkOS SSO
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || "",
      redirect_uri: `${window.location.origin}/api/auth/callback`,
      response_type: "code",
      provider: "authkit",
    });
    window.location.href = `https://api.workos.com/sso/authorize?${params.toString()}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Sign in with SSO"
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Authentication is managed by your organization&apos;s identity
          provider via WorkOS.
        </p>
      </div>
    </div>
  );
}
