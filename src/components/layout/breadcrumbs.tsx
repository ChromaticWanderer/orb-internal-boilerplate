"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    str
  );
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const breadcrumbs: { label: string; href: string }[] = [];
  let currentPath = "";

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Skip UUID segments in display
    if (isUUID(segment)) return;

    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({ label, href: currentPath });
  });

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className={cn("flex items-center space-x-1 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconHome className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.href} className="flex items-center space-x-1">
            <IconChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
