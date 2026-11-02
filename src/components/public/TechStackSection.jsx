import TechnologyIcon from "@/components/public/TechnologyIcon";

const labels = {
  FRONTEND: "Frontend", BACKEND: "Backend & APIs", DATABASE: "Databases",
  MOBILE: "Mobile", DEVOPS: "DevOps", TOOL: "Tools", OTHER: "Other",
};

export default function TechStackSection({ technologies = [] }) {
  if (!technologies.length) return null;

  const grouped = technologies.reduce((result, technology) => {
    const name = technology.category || "OTHER";
    (result[name] ||= []).push(technology);
    return result;
  }, {});

  return (
    <section className="bg-white py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:px-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">05 / Engineering toolkit</p>
          <h2 className="mt-5 text-[clamp(2.4rem,4.4vw,4.1rem)] font-semibold leading-[1.09] tracking-[-.055em] text-[#142E23]">The right technology for the right problem.</h2>
          <p className="mt-6 max-w-md text-base leading-8 text-[#65766A]">I work with modern tools, but the goal is always the same: reliable software, clear experiences and maintainable solutions.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(grouped).map(([category, items]) => (
            <article key={category} className="rounded-[22px] border border-[#E0E8E0] bg-[#F9FAF7] p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[.17em] text-[#487C5F]">{labels[category] || category}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {items.map((technology) => {

                  return (
                    <span key={technology.id} className="inline-flex items-center gap-2 rounded-full border border-[#DFE9DF] bg-white px-3.5 py-2 text-xs font-semibold text-[#31533D]">
                      <TechnologyIcon name={technology.name} />
                      {technology.name}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
