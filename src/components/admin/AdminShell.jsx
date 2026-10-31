"use client";

import {
  useState,
} from "react";
import { X } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({
  admin,
  children,
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileOpen(false)
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative h-full w-72 border-r border-white/10">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(false)
              }
              className="absolute right-3 top-3 z-10 rounded-lg border border-white/10 bg-neutral-900 p-2 text-neutral-300"
            >
              <X size={18} />
            </button>

            <AdminSidebar
              onNavigate={() =>
                setMobileOpen(false)
              }
            />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <AdminTopbar
          admin={admin}
          onMenuOpen={() =>
            setMobileOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}