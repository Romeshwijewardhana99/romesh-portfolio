"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, Wrench, Code2, MessageSquareQuote,
  Inbox, Settings, ExternalLink, ArrowUpRight, Layers3,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Technologies", href: "/admin/technologies", icon: Code2 },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-[#315443] bg-[#102D25] text-white">
      <div className="border-b border-white/10 px-6 pb-7 pt-7">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#5F8B70] bg-[#1D4E38] text-[#D4F1DB]">
            <Layers3 size={23} strokeWidth={1.6} />
          </span>
          <span>
            <span className="block text-[21px] font-bold tracking-[-.07em]">Romesh<span className="text-[#8FE0AD]">.</span></span>
            <span className="block text-[10px] font-semibold uppercase tracking-[.22em] text-[#9EC7AC]">Portfolio CMS</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-7">
        <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#7FAA8E]">Workspace</p>
        <div className="space-y-1.5">
          {navigation.map(({ name, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-[#D8F2DE] text-[#153C2C] shadow-sm"
                    : "text-[#B8D4C2] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{name}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#28865C]" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold text-[#E0EEE3] hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2"><ExternalLink size={17} />View Live Portfolio</span>
          <ArrowUpRight size={15} />
        </Link>
        <p className="px-2 pt-5 text-[10px] tracking-[.1em] text-[#749E84]">INDEPENDENT DEVELOPMENT STUDIO</p>
      </div>
    </aside>
  );
}
