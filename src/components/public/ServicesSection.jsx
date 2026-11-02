import Link from "next/link";
import { ArrowUpRight, Code2, Layers3, PanelsTopLeft, Database, Wrench, MonitorCog } from "lucide-react";

const icons = [Layers3, MonitorCog, PanelsTopLeft, Database, Wrench, Code2];

export default function ServicesSection({ services = [] }) {
  if (!services.length) return null;

  return (
    <section id="services" className="bg-white py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">02 / What I do</p>
            <h2 className="mt-5 max-w-[650px] text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[1.08] tracking-[-.06em] text-[#142E23]">Software built around your business.</h2>
          </div>
          <p className="max-w-[465px] text-base leading-8 text-[#63766A] lg:ml-auto">From your first idea to improving a live product, I build digital solutions designed to solve practical problems and make everyday work easier.</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link href="/contact" key={service.id} className="group flex min-h-[300px] flex-col rounded-[23px] border border-[#E2E9E0] bg-[#F9FAF7] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#A5C9B0] hover:bg-[#EDF5EC] hover:shadow-[0_18px_40px_rgba(22,67,42,.08)] sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[15px] border border-[#D9E7D9] bg-white text-[#225D41]"><Icon size={22} strokeWidth={1.7}/></span>
                  <span className="text-xs font-semibold tracking-[.14em] text-[#819489]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-9 text-[23px] font-semibold leading-[1.2] tracking-[-.035em] text-[#18382A]">{service.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-[#64766A]">{service.shortDescription}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-[#225F43]">Discuss this service <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
