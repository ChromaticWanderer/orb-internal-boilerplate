"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/types";

/**
 * Client-side auth hook. Reads the user_email cookie and fetches user details.
 * For server components, use getCurrentUser() from @/lib/auth/workos-auth instead.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Read email from cookie (set during WorkOS auth callback)
        const email = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_email="))
          ?.split("=")[1];

        if (!email) {
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("users")
          .select("id, email, name, role, organization_id, status")
          .eq("email", decodeURIComponent(email))
          .single();

        if (dbError || !data) {
          setError("Failed to load user");
          setLoading(false);
          return;
        }

        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          organization_id: data.organization_id,
          status: data.status,
        });
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
