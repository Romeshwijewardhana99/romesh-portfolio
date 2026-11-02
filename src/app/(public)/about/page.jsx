import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Download, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "About Romesh | Full-Stack Developer",
  description: "Learn about Romesh Wijewardhana, an independent full-stack developer focused on practical business software and thoughtful web experiences.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <main className="bg-[#F7F7F2]">
      <section className="bg-[#102D25] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1224px]">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#9CD7B6]">About / Romesh Wijewardhana</p>
          <h1 className="mt-7 max-w-[1050px] text-[clamp(3rem,6vw,6.3rem)] font-semibold leading-[1.05] tracking-[-.07em]">Engineering thoughtful digital experiences.</h1>
          <p className="mt-8 max-w-[720px] text-lg leading-9 text-[#C4DBCD]">I&apos;m Romesh, a full-stack developer focused on translating real needs into useful, reliable applications. I work across frontend interfaces, backend systems and the practical details of delivery.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-[#D8F2DE] px-6 py-3.5 text-sm font-bold text-[#153B2A]">Explore my work <ArrowUpRight size={17}/></Link>
            {settings?.resumeUrl && <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white">View résumé <Download size={16}/></a>}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-24 lg:px-12 lg:py-32">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">My approach</p>
          <h2 className="mt-5 text-[clamp(2.5rem,4vw,4rem)] font-semibold leading-[1.1] tracking-[-.06em] text-[#142E23]">More than code. Real-world problem solving.</h2>
          <p className="mt-7 text-base leading-8 text-[#627669]">A successful digital product needs clear goals, good user experience and a dependable technical foundation. I approach each project with all three in mind.</p>
        </div>
        <div className="space-y-5">
          {[
            ["Full-stack perspective", "From responsive UI to APIs, data and deployment, I understand how the pieces connect."],
            ["Business-focused thinking", "I start with the workflow or problem instead of adding unnecessary complexity."],
            ["Care for the details", "Readable interfaces, maintainable code and practical communication matter throughout the build."],
          ].map(([title,text]) => <article key={title} className="flex gap-4 rounded-[20px] border border-[#DDE8DD] bg-white p-6"><CheckCircle2 className="mt-1 shrink-0 text-[#38845C]" size={21}/><div><h3 className="text-lg font-bold tracking-[-.03em] text-[#1D402E]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#63786B]">{text}</p></div></article>)}
        </div>
      </section>
      <section className="bg-[#EAF1E8] px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1224px] flex-col justify-between gap-7 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">Get in touch</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.055em] text-[#173B2B] sm:text-4xl">Let&apos;s talk about what&apos;s next.</h2><p className="mt-3 max-w-lg text-sm leading-7 text-[#607467]">Open to conversations about projects and relevant engineering opportunities.</p></div><div className="flex flex-wrap items-center gap-3"><Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#174734] px-6 py-3.5 text-sm font-bold text-white">Contact me <Mail size={16}/></Link>{settings?.githubUrl && <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-full border border-[#B9CEBD] p-3 text-[#1D5038]"><FaGithub size={20}/></a>}{settings?.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full border border-[#B9CEBD] p-3 text-[#1D5038]"><FaLinkedinIn size={20}/></a>}</div></div></section>
    </main>
  );
}
