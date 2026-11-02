import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Building2 } from "lucide-react";

export default function CTASection({ availableForWork = true }) {
  return (
    <section className="bg-[#F7F7F2] px-5 pb-24 pt-6 sm:px-8 lg:px-12 lg:pb-32">
      <div className="relative mx-auto max-w-[1224px] overflow-hidden rounded-[30px] bg-[#174734] px-7 py-14 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-white/10"/>
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-[360px] w-[360px] rounded-full border border-white/10"/>
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#AEDCBF]">07 / Your next move</p>
          <h2 className="mt-6 max-w-[770px] text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[1.08] tracking-[-.06em]">Have something ambitious in mind? Let&apos;s build it right.</h2>
          <p className="mt-6 max-w-[570px] text-base leading-8 text-[#C4DED0]">Whether you need a reliable development partner or a full-stack engineer on your team, I&apos;d love to hear what you&apos;re working on.</p>
          <div className="mt-10 grid max-w-[780px] gap-3 sm:grid-cols-2">
            <Link href="/contact" className="group flex items-center justify-between rounded-[18px] bg-[#E1F5E6] p-5 text-[#163F2D] transition hover:bg-white"><span className="flex items-center gap-3 text-sm font-bold"><BriefcaseBusiness size={20}/> Start a project</span><ArrowUpRight size={20} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></Link>
            <Link href="/about" className="group flex items-center justify-between rounded-[18px] border border-white/25 bg-white/5 p-5 text-white transition hover:bg-white/10"><span className="flex items-center gap-3 text-sm font-bold"><Building2 size={20}/> Hiring? Explore my profile</span><ArrowUpRight size={20} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></Link>
          </div>
          {availableForWork && <p className="mt-7 flex items-center gap-2 text-xs text-[#C1E6D1]"><span className="h-2 w-2 rounded-full bg-[#8DE4AC]"/> Currently open to new project discussions</p>}
        </div>
      </div>
    </section>
  );
}
