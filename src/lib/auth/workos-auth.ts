import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  /** Platform-level role from users table */
  role: "admin" | "area_manager" | "franchisee" | "staff";
  organization_id: string;
  status: "active" | "inactive" | "pending";
}

export interface AuthResult {
  user: AuthUser | null;
  authenticated: boolean;
  error?: string;
}

/**
 * Get the current authenticated user from WorkOS session cookies.
 * Queries the shared users table to resolve user details.
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;
    const sessionToken = cookieStore.get("workos_session")?.value;

    if (!userEmail || !sessionToken) {
      return { authenticated: false, user: null, error: "No active session" };
    }

    const supabase = createAdminClient();

    // Fetch user from shared users table
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, organization_id, status")
      .eq("email", userEmail)
      .single();

    if (error || !user) {
      return {
        authenticated: false,
        user: null,
        error: "User not found in database",
      };
    }

    if (user.status !== "active") {
      return {
        authenticated: false,
        user: null,
        error: `Account is ${user.status}`,
      };
    }

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization_id: user.organization_id,
        status: user.status,
      },
    };
  } catch {
    return { authenticated: false, user: null, error: "Authentication error" };
  }
}

/**
 * Get the current user or throw. Use in server components/actions
 * that require authentication.
 */
export async function requireUser(): Promise<AuthUser> {
  const { user, authenticated, error } = await getCurrentUser();
  if (!authenticated || !user) {
    throw new Error(error || "Authentication required");
  }
  return user;
}

/**
 * Check if user has any of the specified platform roles.
 */
export function hasRole(
  user: AuthUser,
  requiredRoles: Array<"admin" | "area_manager" | "franchisee" | "staff">
): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Get the current user and verify they have one of the required roles.
 * Throws if not authenticated or role is insufficient.
 */
export async function requireRole(
  roles: Array<"admin" | "area_manager" | "franchisee" | "staff">
): Promise<AuthUser> {
  const user = await requireUser();
  if (!hasRole(user, roles)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}

/**
 * Get the current user's organization_id, or throw.
 */
export async function getUserOrganizationId(): Promise<string> {
  const user = await requireUser();
  return user.organization_id;
}
