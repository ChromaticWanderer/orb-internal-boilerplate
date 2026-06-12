import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getWorkos,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const cookiePassword = process.env.WORKOS_COOKIE_PASSWORD;
  if (!cookiePassword || cookiePassword.length < 32) {
    console.error(
      "WORKOS_COOKIE_PASSWORD is missing or too short (min 32 chars)"
    );
    return NextResponse.redirect(
      new URL("/login?error=server_config", request.url)
    );
  }

  try {
    const { user, sealedSession } =
      await getWorkos().userManagement.authenticateWithCode({
        code,
        clientId: process.env.WORKOS_CLIENT_ID!,
        session: {
          sealSession: true,
          cookiePassword,
        },
      });

    if (!sealedSession) {
      console.error("WorkOS returned no sealed session");
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", request.url)
      );
    }

    const cookieStore = await cookies();

    // The encrypted sealed session is the ONLY authoritative credential.
    cookieStore.set(SESSION_COOKIE_NAME, sealedSession, SESSION_COOKIE_OPTIONS);

    // Display-only convenience cookie — NEVER trusted for auth decisions.
    cookieStore.set("user_email", user.email, {
      ...SESSION_COOKIE_OPTIONS,
      httpOnly: true,
    });

    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("WorkOS auth callback error:", error);
    const loginUrl = new URL("/login?error=auth_failed", request.url);
    return NextResponse.redirect(loginUrl);
  }
}
