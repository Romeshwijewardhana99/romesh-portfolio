"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Work", href: "/projects" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ siteName = "Romesh Wijewardhana" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("a")?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#183027]/10 bg-[#F7F7F2]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label={`${siteName || "Romesh"} home`} className="group flex items-center gap-3">
          <span className="text-[27px] font-bold tracking-[-0.08em] text-[#142D23]">
            Romesh<span className="text-[#2E966A]">.</span>
          </span>
          <span className="hidden border-l border-[#183027]/20 pl-3 text-[10px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-[#6F7D74] sm:block">
            Full-stack developer
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const active = link.href === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors hover:text-[#1E8B61] ${active ? "text-[#1E8B61]" : "text-[#4D6258]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden items-center gap-2 rounded-full bg-[#133D2D] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#245D43] lg:inline-flex"
        >
          Let&apos;s Work Together <ArrowUpRight size={16} />
        </Link>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#183027]/15 text-[#183027] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <nav ref={panelRef} id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#183027]/10 bg-[#F7F7F2] px-5 pb-6 pt-3 lg:hidden">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3.5 text-base font-medium text-[#294237] hover:bg-[#E8EFE8]"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-between rounded-xl bg-[#133D2D] px-4 py-4 text-sm font-semibold text-white">
            Start a project <ArrowUpRight size={17} />
          </Link>
        </nav>
      )}
    </header>
  );
}
