import Link from "next/link";
import { FaFigma } from "react-icons/fa";
import { ArrowUpRight, Check, Code2, ServerCog } from "lucide-react";

export default function AboutPreview({ settings }) {
  return (
    <section className="overflow-hidden bg-[#EAF0E8] py-24 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.08fr] lg:gap-24 lg:px-12">
        <div className="relative rounded-[30px] bg-[#153A2C] p-7 text-white shadow-[0_30px_80px_rgba(30,67,43,.15)] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#91C9A7]">The way I build</p>
          <h3 className="mt-5 max-w-[390px] text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.15] tracking-[-.045em]">One developer. The whole picture.</h3>
          <p className="mt-5 max-w-[390px] text-sm leading-7 text-[#C3D6C8]">Thoughtful interfaces on the front. Solid systems behind the scenes. A practical approach from problem to deployment.</p>
          <div className="mt-9 space-y-3">
            {[
              { icon: FaFigma, label: "User-centered UI and product thinking" },
              { icon: Code2, label: "Frontend and backend engineering" },
              { icon: ServerCog, label: "Deployment and ongoing improvements" },
            ].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-3 rounded-[15px] border border-white/10 bg-white/5 px-4 py-4"><Icon size={19} className="shrink-0 text-[#B5E8C4]"/><span className="text-sm font-medium text-[#E9F4ED]">{label}</span><Check size={15} className="ml-auto shrink-0 text-[#A5DCB7]"/></div>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">03 / Behind the work</p>
          <h2 className="mt-5 text-[clamp(2.4rem,4.7vw,4.5rem)] font-semibold leading-[1.09] tracking-[-.06em] text-[#142E23]">A hands-on partner, not just another developer.</h2>
          <p className="mt-7 text-base leading-8 text-[#5D7365]">I&apos;m Romesh, an independent full-stack developer who enjoys understanding the problem before choosing the technology. I work across design, frontend, backend and delivery to create solutions that are both useful and maintainable.</p>
          <p className="mt-4 text-base leading-8 text-[#5D7365]">Whether you&apos;re planning a new business application or hiring an engineer who can think beyond a single feature, I bring a practical, end-to-end perspective.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/about" className="inline-flex items-center gap-2 rounded-full bg-[#173F2F] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#276145]">More about me <ArrowUpRight size={16}/></Link>
            {settings?.resumeUrl && <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#B6CDBB] px-6 py-3.5 text-sm font-semibold text-[#17432E] hover:bg-white">View résumé <ArrowUpRight size={16}/></a>}
          </div>
        </div>
      </div>
    </section>
  );
}
