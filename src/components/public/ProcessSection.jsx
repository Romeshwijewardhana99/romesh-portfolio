import { ArrowUpRight } from "lucide-react";

const steps = [
  { number: "01", title: "Discover", body: "Understand the problem, goals, users and constraints before writing code." },
  { number: "02", title: "Define", body: "Map the features, design direction, delivery stages and technical approach." },
  { number: "03", title: "Develop", body: "Build clear interfaces and dependable backend workflows, with feedback throughout." },
  { number: "04", title: "Deliver", body: "Test the experience, launch carefully and plan for what comes next." },
];

export default function ProcessSection() {
  return (
    <section className="bg-[#F7F7F2] py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">04 / My process</p><h2 className="mt-5 max-w-[680px] text-[clamp(2.4rem,4.5vw,4.2rem)] font-semibold leading-[1.09] tracking-[-.055em] text-[#142E23]">Clear thinking. Confident execution.</h2></div>
          <p className="max-w-[360px] text-sm leading-7 text-[#63766A]">A transparent, collaborative process that keeps the project focused on what matters.</p>
        </div>
        <div className="mt-14 grid overflow-hidden rounded-[25px] border border-[#DDE5DC] bg-[#DDE5DC] gap-px sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="group flex min-h-[255px] flex-col bg-white p-7 sm:p-8">
              <div className="flex items-start justify-between"><span className="text-xs font-bold text-[#398763]">{step.number} / 04</span><ArrowUpRight className="text-[#B8C8BA] transition group-hover:-translate-y-1 group-hover:translate-x-1" size={17}/></div>
              <h3 className="mt-auto pt-12 text-2xl font-semibold tracking-[-.04em] text-[#203F2F]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6C7A70]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
