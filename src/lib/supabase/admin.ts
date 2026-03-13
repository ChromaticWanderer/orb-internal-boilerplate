import { createServerClient } from "@supabase/ssr";

/**
 * Creates a Supabase admin client (service role) that bypasses RLS.
 * Use only in API routes, auth callbacks, and admin operations.
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          /* No-op — admin client doesn't need cookies */
        },
      },
    }
  );
}
