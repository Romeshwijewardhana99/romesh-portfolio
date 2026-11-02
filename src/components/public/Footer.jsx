import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

export default function Footer({ settings }) {
  const socials = [
    {label:"GitHub",url:settings?.githubUrl,icon:FaGithub},
    {label:"LinkedIn",url:settings?.linkedinUrl,icon:FaLinkedinIn},
    {label:"Instagram",url:settings?.instagramUrl,icon:FaInstagram},
    {label:"Facebook",url:settings?.facebookUrl,icon:FaFacebookF},
  ].filter((entry) => entry.url && /^https?:\/\//i.test(entry.url));

  return (
    <footer className="border-t border-[#D8E2D8] bg-[#EFF3ED]">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.2fr_.6fr_.8fr]">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-[-.075em] text-[#17382A]">Romesh<span className="text-[#2D9666]">.</span></Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#647669]">Independent full-stack development, thoughtful digital experiences and practical software solutions.</p>
            {socials.length > 0 && <div className="mt-6 flex gap-2">{socials.map(({label,url,icon:Icon}) => <a href={url} key={label} aria-label={label} rel="noopener noreferrer" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBDDCD] text-[#315B41] transition hover:bg-white"><Icon size={17}/></a>)}</div>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#3B7250]">Navigate</p>
            <nav className="mt-6 flex flex-col items-start gap-3 text-sm font-medium text-[#516658]">
              <Link href="/projects" className="hover:text-[#178158]">Work</Link>
              <Link href="/#services" className="hover:text-[#178158]">Services</Link>
              <Link href="/about" className="hover:text-[#178158]">About</Link>
              <Link href="/contact" className="hover:text-[#178158]">Contact</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#3B7250]">Let&apos;s connect</p>
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#596D5C]">Have a project idea or an engineering opportunity to discuss?</p>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#194B33] hover:text-[#178158]">Start a conversation <ArrowUpRight size={16}/></Link>
            {settings?.email && <a className="mt-4 flex items-center gap-2 break-all text-xs text-[#647669] hover:text-[#194B33]" href={`mailto:${settings.email}`}><Mail size={14} className="shrink-0"/>{settings.email}</a>}
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-[#D6E0D5] pt-6 text-xs text-[#77897A] sm:flex-row"><p>© {new Date().getFullYear()} Romesh Wijewardhana. All rights reserved.</p><p>Designed with care. Engineered to last.</p></div>
      </div>
    </footer>
  );
}
