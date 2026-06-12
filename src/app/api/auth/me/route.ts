import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/workos-auth";

/**
 * Returns the current authenticated user (verified sealed session + DB
 * lookup). Used by the client-side useAuth() hook — the session cookie is
 * httpOnly, so client JS cannot (and must not) read identity directly.
 */
export async function GET() {
  const { user, authenticated, error } = await getCurrentUser();

  if (!authenticated || !user) {
    return NextResponse.json(
      { user: null, error: error ?? "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
