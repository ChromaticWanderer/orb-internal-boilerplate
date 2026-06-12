import { NextResponse, type NextRequest } from "next/server";
import {
  verifySealedSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/session";

/**
 * WorkOS sealed-session middleware.
 *
 * Verifies the encrypted sealed session on every protected request
 * (JWT signature against WorkOS JWKS, transparent token refresh).
 * Presence of a cookie is NOT enough — the session must verify.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth routes — login page and callback
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/api/auth/callback");

  // Public routes that don't need auth
  const isPublicRoute = isAuthRoute;

  // API routes handle their own auth (via requireUser/getCurrentUser)
  const isApiRoute = pathname.startsWith("/api/");

  const sealed = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const verified =
    !isPublicRoute && !isApiRoute && sealed
      ? await verifySealedSession(sealed)
      : null;

  // No verified session + protected route -> redirect to login, clear cookies
  if (!verified && !isPublicRoute && !isApiRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    res.cookies.set("user_email", "", { path: "/", maxAge: 0 });
    return res;
  }

  // Verified session + on login page -> redirect to dashboard
  if (pathname.startsWith("/login") && sealed) {
    const loginCheck = await verifySealedSession(sealed);
    if (loginCheck) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();

  // Persist the rotated session if the access token was refreshed
  if (verified?.refreshedSealedSession) {
    response.cookies.set(
      SESSION_COOKIE_NAME,
      verified.refreshedSealedSession,
      SESSION_COOKIE_OPTIONS
    );
  }

  return response;
}
