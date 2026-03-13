"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Exchange the authorization code via the API route
      fetch(`/api/auth/callback?code=${code}`)
        .then((res) => {
          if (res.ok) {
            router.push("/");
          } else {
            router.push("/login?error=callback_failed");
          }
        })
        .catch(() => {
          router.push("/login?error=callback_failed");
        });
    } else {
      router.push("/login?error=no_code");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
