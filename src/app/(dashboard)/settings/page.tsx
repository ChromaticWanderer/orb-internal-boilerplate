import { requireUser } from "@/lib/auth/workos-auth";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-sm">{user.name || "Not set"}</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="text-sm capitalize">{user.role.replace("_", " ")}</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">
              Organization ID
            </p>
            <p className="font-mono text-sm">{user.organization_id}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Application preferences will be configured here. Use the theme toggle
          in the navbar to switch between light and dark mode.
        </p>
      </div>
    </div>
  );
}
