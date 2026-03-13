"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth/workos-auth";
import {
  IconMenu2,
  IconUser,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { Breadcrumbs } from "./breadcrumbs";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  user: AuthUser;
  onSidebarToggle: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ user, onSidebarToggle }: NavbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const userInitials = (user.name || user.email)
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <IconMenu2 className="h-5 w-5" />
        </button>

        <div className="hidden md:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {userInitials}
            </div>
            <div className="hidden text-left lg:block">
              <p className="text-sm font-medium">
                {user.name || user.email.split("@")[0]}
              </p>
              <p className="max-w-[150px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-popover p-1 shadow-lg">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <IconUser className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <IconSettings className="h-4 w-4" />
                  Settings
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  <IconLogout className="h-4 w-4" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
