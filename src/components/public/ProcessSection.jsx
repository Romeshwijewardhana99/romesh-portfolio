const steps = [
  {
    number: "01",
    title: "Discovery",
    text: "We discuss your goals, users, requirements and the problem the product needs to solve.",
  },
  {
    number: "02",
    title: "Planning",
    text: "I define the scope, features, technical architecture and development approach.",
  },
  {
    number: "03",
    title: "Build",
    text: "The product is developed through clear stages with responsive UI and reliable backend logic.",
  },
  {
    number: "04",
    title: "Test & Launch",
    text: "Functionality, usability and responsiveness are tested before production deployment.",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-neutral-100 py-24 dark:bg-white/[0.025]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
            Process
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            A clear path from
            idea to launch.
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          {steps.map(
            (step) => (
              <article
                key={
                  step.number
                }
                className="bg-white p-7 dark:bg-neutral-950"
              >
                <span className="text-sm text-neutral-400">
                  {step.number}
                </span>

                <h3 className="mt-10 text-xl font-medium">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {step.text}
                </p>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}