"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Code2,
  MessageSquareQuote,
  Inbox,
  Settings,
  ExternalLink,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    name: "Technologies",
    href: "/admin/technologies",
    icon: Code2,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Inquiries",
    href: "/admin/inquiries",
    icon: Inbox,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  onNavigate,
}) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full flex-col bg-neutral-950">
      <div className="border-b border-white/10 px-6 py-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="block"
        >
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500">
            Portfolio
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Admin CMS
          </h2>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} />

          View Portfolio
        </Link>
      </div>
    </aside>
  );
}