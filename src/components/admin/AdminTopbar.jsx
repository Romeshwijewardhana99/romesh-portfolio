"use client";

import {
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";

import LogoutButton from "./LogoutButton";

function getPageTitle(pathname) {
  if (pathname === "/admin") {
    return "Dashboard";
  }

  if (
    pathname.startsWith(
      "/admin/projects"
    )
  ) {
    return "Projects";
  }

  if (
    pathname.startsWith(
      "/admin/services"
    )
  ) {
    return "Services";
  }

  if (
    pathname.startsWith(
      "/admin/technologies"
    )
  ) {
    return "Technologies";
  }

  if (
    pathname.startsWith(
      "/admin/testimonials"
    )
  ) {
    return "Testimonials";
  }

  if (
    pathname.startsWith(
      "/admin/inquiries"
    )
  ) {
    return "Inquiries";
  }

  if (
    pathname.startsWith(
      "/admin/settings"
    )
  ) {
    return "Settings";
  }

  return "Admin";
}

export default function AdminTopbar({
  admin,
  onMenuOpen,
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            className="rounded-xl border border-white/10 p-2 text-neutral-300 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="font-medium text-white">
              {getPageTitle(
                pathname
              )}
            </h1>

            <p className="hidden text-xs text-neutral-500 sm:block">
              Portfolio Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-white">
              {admin.name}
            </p>

            <p className="text-xs text-neutral-500">
              {admin.role}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}