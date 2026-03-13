"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconLayoutDashboard,
  IconSettings,
  IconX,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import type { NavItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: IconLayoutDashboard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: IconSettings,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive =
      item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href);
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <div key={item.title}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              level > 0 && "pl-10",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground"
            )}
          >
            {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0" />}
            <span className="flex-1 text-left">{item.title}</span>
            {isExpanded ? (
              <IconChevronDown className="h-4 w-4" />
            ) : (
              <IconChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              level > 0 && "pl-10",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground"
            )}
          >
            {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0" />}
            {item.title}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar-background shadow-lg transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-sidebar-border px-6">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              App Name
            </h1>
            <button
              className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
              onClick={onClose}
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => renderNavItem(item))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-6 py-4">
            <p className="text-xs text-muted-foreground">v0.1.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
