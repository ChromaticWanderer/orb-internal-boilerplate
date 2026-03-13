import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";
import { cookies } from "next/headers";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const { user, organizationId } =
      await workos.userManagement.authenticateWithCode({
        code,
        clientId: process.env.WORKOS_CLIENT_ID!,
      });

    const cookieStore = await cookies();

    // Set session cookies
    cookieStore.set("workos_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set("user_email", user.email, {
      httpOnly: false, // Readable by client-side auth hook
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    if (organizationId) {
      cookieStore.set("organization_id", organizationId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Redirect to dashboard
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("WorkOS auth callback error:", error);
    const loginUrl = new URL("/login?error=auth_failed", request.url);
    return NextResponse.redirect(loginUrl);
  }
}
