"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/admin/login");
      router.refresh();
    } catch {
      window.alert("Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Sign out"
      className="inline-flex items-center gap-2 rounded-xl border border-[#CFDDCE] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#315B40] transition hover:border-[#9DBCA1] hover:bg-[#E7F1E6] disabled:opacity-60"
    >
      <LogOut size={15} />
      <span className="hidden sm:inline">{loading ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}
