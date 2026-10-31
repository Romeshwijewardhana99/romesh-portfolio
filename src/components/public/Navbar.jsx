"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

const links = [
  {
    name: "Work",
    href: "/projects",
  },
  {
    name: "Services",
    href: "/#services",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Navbar({
  siteName = "Romesh Wijewardhana",
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight"
        >
          {siteName}
          <span className="text-neutral-400">
            .
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black"
          >
            Start a Project
            <ArrowUpRight size={15} />
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Open navigation"
          onClick={() =>
            setOpen(!open)
          }
          className="rounded-lg border border-neutral-200 p-2 md:hidden dark:border-white/10"
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-6 py-5 md:hidden dark:border-white/10 dark:bg-neutral-950">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl px-3 py-3 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() =>
                setOpen(false)
              }
              className="mt-3 rounded-xl bg-neutral-950 px-4 py-3 text-center text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              Start a Project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}