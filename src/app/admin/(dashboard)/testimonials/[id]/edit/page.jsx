import Link from "next/link";
import {
  notFound,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function EditTestimonialPage({
  params,
}) {
  const { id } = await params;

  const testimonialId =
    Number(id);

  if (
    !Number.isInteger(
      testimonialId
    )
  ) {
    notFound();
  }

  const [
    testimonial,
    projects,
  ] = await Promise.all([
    prisma.testimonial.findUnique({
      where: {
        id: testimonialId,
      },
    }),

    prisma.project.findMany({
      select: {
        id: true,
        title: true,
      },

      orderBy: {
        title: "asc",
      },
    }),
  ]);

  if (!testimonial) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/admin/testimonials"
        className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft size={16} />

        Back to Testimonials
      </Link>

      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Editing Testimonial
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          {testimonial.clientName}
        </h1>
      </div>

      <TestimonialForm
        testimonial={testimonial}
        projects={projects}
      />
    </section>
  );
}