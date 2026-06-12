import { cookies } from "next/headers";
import { WorkOS } from "@workos-inc/node";

/**
 * WorkOS sealed-session handling.
 *
 * SECURITY: the ONLY source of identity is the encrypted sealed session
 * stored in the SESSION_COOKIE_NAME cookie. It is created by WorkOS with
 * sealSession: true on the callback, and verified (JWT signature against
 * WorkOS JWKS) on every request. Never trust a plain user_email cookie —
 * that pattern caused a cross-app auth bypass (fixed June 2026).
 */

export const SESSION_COOKIE_NAME = "workos_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days (refresh-token lifetime)
};

// Lazy singleton — instantiating WorkOS at module level breaks `next build`
// when env vars are absent (build-time page-data collection imports this file).
let _workos: WorkOS | null = null;

export function getWorkos(): WorkOS {
  if (!_workos) {
    // clientId is required for JWKS verification of access tokens
    _workos = new WorkOS(process.env.WORKOS_API_KEY!, {
      clientId: process.env.WORKOS_CLIENT_ID!,
    });
  }
  return _workos;
}

function getCookiePassword(): string | null {
  const pw = process.env.WORKOS_COOKIE_PASSWORD;
  if (!pw || pw.length < 32) {
    console.error(
      "[auth] WORKOS_COOKIE_PASSWORD is missing or shorter than 32 chars"
    );
    return null;
  }
  return pw;
}

export interface VerifiedSession {
  email: string;
  workosUserId: string;
  organizationId?: string;
  role?: string;
  /** Present when the access token was refreshed — persist this to the cookie. */
  refreshedSealedSession?: string;
}

/**
 * Verify a sealed session: unseal → JWT verification → transparent refresh.
 * Returns null for missing/invalid/expired sessions.
 */
export async function verifySealedSession(
  sealedSession: string | undefined | null
): Promise<VerifiedSession | null> {
  const cookiePassword = getCookiePassword();
  if (!cookiePassword || !sealedSession) return null;

  try {
    const session = getWorkos().userManagement.loadSealedSession({
      sessionData: sealedSession,
      cookiePassword,
    });

    const authResult = await session.authenticate();
    if (authResult.authenticated) {
      return {
        email: authResult.user.email,
        workosUserId: authResult.user.id,
        organizationId: authResult.organizationId,
        role: authResult.role,
      };
    }

    // Access token expired — try a transparent refresh
    const refreshResult = await session.refresh();
    if (refreshResult.authenticated && refreshResult.user) {
      return {
        email: refreshResult.user.email,
        workosUserId: refreshResult.user.id,
        organizationId: refreshResult.organizationId,
        role: refreshResult.role,
        refreshedSealedSession: refreshResult.sealedSession,
      };
    }
  } catch (error) {
    console.error("[auth] Sealed session verification failed:", error);
  }
  return null;
}

/**
 * Read + verify the session cookie. Server components / route handlers.
 */
export async function getVerifiedSession(): Promise<VerifiedSession | null> {
  const cookieStore = await cookies();
  const sealed = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySealedSession(sealed);
}

/** Convenience: verified email or null. */
export async function getVerifiedEmail(): Promise<string | null> {
  const session = await getVerifiedSession();
  return session?.email ?? null;
}
