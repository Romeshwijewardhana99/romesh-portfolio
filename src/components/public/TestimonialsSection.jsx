import {
  Quote,
  Star,
} from "lucide-react";

export default function TestimonialsSection({
  testimonials,
}) {
  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
            Testimonials
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            What clients say.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(
            (testimonial) => (
              <article
                key={
                  testimonial.id
                }
                className="flex flex-col rounded-3xl border border-neutral-200 p-7 dark:border-white/10"
              >
                <Quote
                  size={24}
                  className="text-neutral-300 dark:text-neutral-700"
                />

                {testimonial.rating && (
                  <div className="mt-6 flex gap-1">
                    {Array.from({
                      length:
                        testimonial.rating,
                    }).map(
                      (_, index) => (
                        <Star
                          key={
                            index
                          }
                          size={
                            14
                          }
                          fill="currentColor"
                        />
                      )
                    )}
                  </div>
                )}

                <p className="mt-5 flex-1 leading-7 text-neutral-600 dark:text-neutral-300">
                  “
                  {
                    testimonial.quote
                  }
                  ”
                </p>

                <div className="mt-8 border-t border-neutral-200 pt-5 dark:border-white/10">
                  <p className="font-medium">
                    {
                      testimonial.clientName
                    }
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {[
                      testimonial.clientRole,
                      testimonial.company,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " · "
                      )}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}