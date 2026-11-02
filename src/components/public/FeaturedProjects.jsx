import TechnologyIcon from "@/components/public/TechnologyIcon";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Layers3 } from "lucide-react";

export default function FeaturedProjects({ projects = [] }) {
  return (
    <section id="work" className="bg-[#F7F7F2] py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">01 / Selected work</p>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[1.08] tracking-[-.06em] text-[#142E23]">Proof is in the products.</h2>
            <p className="mt-5 max-w-[590px] text-base leading-8 text-[#627268]">A closer look at the systems and digital experiences I build, from practical workflows to polished interfaces.</p>
          </div>
          <Link href="/projects" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#164A34] hover:text-[#2D996A]">All projects <ArrowUpRight size={17}/></Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-[28px] border border-[#D9E3DA] bg-white px-8 py-16 text-center">
            <Layers3 size={28} className="mx-auto text-[#66937A]"/>
            <h3 className="mt-5 text-2xl font-semibold text-[#183B2C]">Selected work is on the way.</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#708177]">Featured projects published from the admin dashboard will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-12 lg:space-y-20">
            {projects.map((project, index) => {
              const featured = index === 0;
              return (
                <article key={project.id} className={`group grid overflow-hidden rounded-[28px] border border-[#DCE5DB] bg-white shadow-[0_14px_50px_rgba(21,57,39,.04)] ${featured ? "lg:grid-cols-[1.2fr_.8fr]" : "lg:grid-cols-[1fr_.85fr]"}`}>
                  <Link href={`/projects/${project.slug}`} aria-label={`Read ${project.title} case study`} className={`relative block min-h-[270px] overflow-hidden bg-[#E2EAE2] sm:min-h-[380px] ${featured ? "lg:min-h-[485px]" : "lg:min-h-[360px]"}`}>
                    {project.coverImage ? <Image src={project.coverImage} alt={`${project.title} interface`} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.035]"/> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#D3E9D8,#E8EFE8_55%,#F1F5F1)]"><div className="rounded-2xl border border-[#B8D1C2] bg-white/75 p-9 text-center"><Layers3 className="mx-auto text-[#2D7550]" size={30}/><span className="mt-4 block text-lg font-semibold text-[#254A34]">{project.title}</span></div></div>}
                    <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#244C39] shadow-md">{project.projectType || "Web application"}</span>
                  </Link>
                  <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#378661]">{String(index + 1).padStart(2, "0")} / Case study</p>
                      <h3 className="mt-6 text-[clamp(2rem,3.2vw,3.2rem)] font-semibold leading-[1.12] tracking-[-.05em] text-[#183728]">{project.title}</h3>
                      <p className="mt-5 text-[15px] leading-8 text-[#64766B]">{project.shortDescription}</p>
                      {project.technologies?.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{project.technologies.slice(0,6).map(({technology}) => <span key={technology.id} className="inline-flex items-center gap-2 rounded-full border border-[#DCE6DD] bg-[#F8FAF6] px-3 py-1.5 text-xs font-medium text-[#456451]"><TechnologyIcon name={technology.name} />{technology.name}</span>)}</div>}
                    </div>
                    <Link href={`/projects/${project.slug}`} className="mt-10 inline-flex items-center gap-3 self-start text-sm font-bold text-[#164A34] transition hover:gap-4 hover:text-[#2D996A]">Explore case study <ArrowRight size={17}/></Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
