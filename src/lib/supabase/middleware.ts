import { NextResponse, type NextRequest } from "next/server";

/**
 * WorkOS session validation middleware.
 * Checks for workos_session + user_email cookies and redirects accordingly.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("workos_session")?.value;
  const userEmail = request.cookies.get("user_email")?.value;
  const hasSession = !!sessionToken && !!userEmail;

  // Auth routes — login page and callback
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/api/auth/callback");

  // Public routes that don't need auth
  const isPublicRoute = isAuthRoute;

  // API routes handle their own auth
  const isApiRoute = pathname.startsWith("/api/");

  // No session + protected route -> redirect to login
  if (!hasSession && !isPublicRoute && !isApiRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Has session + on login page -> redirect to dashboard
  if (hasSession && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
