import { getCurrentUser } from "@/lib/auth/workos-auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

// Auth-gated: must render per-request, never statically at build time
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, authenticated } = await getCurrentUser();

  if (!authenticated || !user) {
    redirect("/login");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
