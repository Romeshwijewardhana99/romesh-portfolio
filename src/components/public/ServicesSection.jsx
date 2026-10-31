import {
  ArrowUpRight,
} from "lucide-react";

export default function ServicesSection({
  services,
}) {
  if (!services.length) {
    return null;
  }

  return (
    <section
      id="services"
      className="border-t border-neutral-200 py-24 dark:border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
              Services
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              What I can help
              you build.
            </h2>

            <p className="mt-5 max-w-sm leading-7 text-neutral-500">
              Digital solutions
              designed around real
              business requirements,
              not just technology.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-white/10 dark:border-white/10">
            {services.map(
              (
                service,
                index
              ) => (
                <div
                  key={
                    service.id
                  }
                  className="group grid gap-4 py-7 sm:grid-cols-[70px_1fr_30px]"
                >
                  <span className="text-sm text-neutral-400">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <h3 className="text-xl font-medium">
                      {
                        service.title
                      }
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                      {
                        service.shortDescription
                      }
                    </p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-neutral-400 transition group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}