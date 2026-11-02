"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu } from "lucide-react";
import LogoutButton from "./LogoutButton";

const titles = [
  ["/admin/projects", "Projects"],
  ["/admin/services", "Services"],
  ["/admin/technologies", "Technologies"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/inquiries", "Inquiries"],
  ["/admin/settings", "Site Settings"],
];

export default function AdminTopbar({ admin, onMenuOpen }) {
  const pathname = usePathname();
  const section = titles.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "Overview";
  const monogram = admin?.name?.trim()?.[0]?.toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 border-b border-[#DFE8DA] bg-[#F7F7F2]/95 backdrop-blur-xl">
      <div className="flex h-[78px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Open admin navigation"
            className="rounded-xl border border-[#CADACB] p-2.5 text-[#194531] lg:hidden"
          ><Menu size={20} /></button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#5B936E]">Portfolio / Admin</p>
            <p className="truncate text-[16px] font-semibold tracking-[-.035em] text-[#173B2B]">{section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 text-xs font-semibold text-[#42644D] hover:text-[#1C8055] md:inline-flex">
            Open Website <ExternalLink size={14} />
          </Link>
          <div className="hidden h-8 w-px bg-[#D7E3D6] sm:block" />
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCECDD] text-sm font-bold text-[#1D6140]">{monogram}</span>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-36 truncate text-xs font-semibold text-[#1F4431]">{admin?.name || "Administrator"}</p>
            <p className="text-[10px] text-[#7A9080]">{admin?.role?.replaceAll("_", " ") || "ADMIN"}</p>
          </div>
          <div className="admin-topbar-logout">
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
