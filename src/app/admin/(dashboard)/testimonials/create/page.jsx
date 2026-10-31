import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function CreateTestimonialPage() {
  const projects =
    await prisma.project.findMany({
      select: {
        id: true,
        title: true,
      },

      orderBy: {
        title: "asc",
      },
    });

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
          Social Proof
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Create Testimonial
        </h1>
      </div>

      <TestimonialForm
        projects={projects}
      />
    </section>
  );
}
