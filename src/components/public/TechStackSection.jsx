export default function TechStackSection({
  technologies,
}) {
  if (!technologies.length) {
    return null;
  }

  const grouped =
    technologies.reduce(
      (result, technology) => {
        const key = technology.category;

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push(technology);

        return result;
      },
      {}
    );

  return (
    <section className="border-t border-neutral-200 py-24 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
            Technology
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Tools chosen for
            the problem.
          </h2>

          <p className="mt-5 leading-7 text-neutral-500">
            I use modern technologies
            to build maintainable,
            scalable and responsive
            digital products.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(
            grouped
          ).map(
            ([
              category,
              items,
            ]) => (
              <div
                key={category}
                className="rounded-2xl border border-neutral-200 p-6 dark:border-white/10"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {category}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map(
                    (
                      technology
                    ) => (
                      <span
                        key={
                          technology.id
                        }
                        className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm dark:bg-white/5"
                      >
                        {
                          technology.name
                        }
                      </span>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
