"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/types";

/**
 * Client-side auth hook. Fetches the verified user from /api/auth/me.
 * The session cookie is httpOnly (sealed session) — client JS cannot read
 * identity from cookies, and must never try to.
 * For server components, use getCurrentUser() from @/lib/auth/workos-auth.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUser(data.user ?? null);
      } catch {
        setError("Authentication error");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return { user, loading, error, logout };
}
