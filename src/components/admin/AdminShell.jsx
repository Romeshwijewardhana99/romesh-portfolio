"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({ admin, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#183729]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[270px] lg:block">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-[#071C13]/70 backdrop-blur-sm"
          />
          <div className="relative h-full w-[270px] max-w-[85vw]">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-xl border border-white/20 p-2 text-white lg:hidden"
            >
              <X size={19} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-[270px]">
        <AdminTopbar admin={admin} onMenuOpen={() => setMobileOpen(true)} />
        <main className="admin-content mx-auto min-h-[calc(100vh-78px)] w-full max-w-[1600px] px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
