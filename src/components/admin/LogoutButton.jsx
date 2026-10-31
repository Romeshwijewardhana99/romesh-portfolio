"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      await fetch(
        "/api/admin/auth/logout",
        {
          method: "POST",
        }
      );

      router.replace(
        "/admin/login"
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
    >
      <LogOut size={16} />

      <span className="hidden sm:inline">
        {loading
          ? "Signing out..."
          : "Logout"}
      </span>
    </button>
  );
}