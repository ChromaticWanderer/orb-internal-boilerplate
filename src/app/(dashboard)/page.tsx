import { requireUser } from "@/lib/auth/workos-auth";
import {
  IconUsers,
  IconBuilding,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";

export default async function DashboardPage() {
  const user = await requireUser();

  const stats = [
    {
      title: "Total Users",
      value: "—",
      icon: IconUsers,
      description: "Active users in your organization",
    },
    {
      title: "Locations",
      value: "—",
      icon: IconBuilding,
      description: "Registered locations",
    },
    {
      title: "Activity",
      value: "—",
      icon: IconChartBar,
      description: "Events this week",
    },
    {
      title: "Uptime",
      value: "99.9%",
      icon: IconClock,
      description: "System availability",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user.name || user.email.split("@")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your organization.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a boilerplate dashboard. Replace these placeholder cards and
          sections with your app&apos;s actual content. Check the sidebar for
          navigation and the settings page for configuration options.
        </p>
      </div>
    </div>
  );
}
