import Link from "next/link";
import {
  Plus,
  Pencil,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";

export default async function TestimonialsPage() {
  const testimonials =
    await prisma.testimonial.findMany({
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            Portfolio Content
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Testimonials
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage client feedback and
            social proof.
          </p>
        </div>

        <Link
          href="/admin/testimonials/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
        >
          <Plus size={17} />

          New Testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">
            No testimonials yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Client feedback can be added
            here when you receive it.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map(
            (testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <h2 className="font-medium text-white">
                          {
                            testimonial.clientName
                          }
                        </h2>

                        {(testimonial.clientRole ||
                          testimonial.company) && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {[
                              testimonial.clientRole,
                              testimonial.company,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          testimonial.isVisible
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                        }`}
                      >
                        {testimonial.isVisible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    {testimonial.rating && (
                      <div className="mt-3 flex gap-1">
                        {Array.from({
                          length:
                            testimonial.rating,
                        }).map(
                          (_, index) => (
                            <Star
                              key={index}
                              size={14}
                              fill="currentColor"
                            />
                          )
                        )}
                      </div>
                    )}

                    <blockquote className="mt-4 text-sm leading-7 text-neutral-300">
                      “{testimonial.quote}”
                    </blockquote>

                    {testimonial.project && (
                      <p className="mt-4 text-xs text-neutral-500">
                        Related project:{" "}
                        {
                          testimonial.project
                            .title
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5"
                    >
                      <Pencil size={15} />

                      Edit
                    </Link>

                    <DeleteTestimonialButton
                      testimonialId={
                        testimonial.id
                      }
                      clientName={
                        testimonial.clientName
                      }
                    />
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}