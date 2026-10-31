import Link from "next/link";
import {
  notFound,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import TechnologyForm from "@/components/admin/TechnologyForm";

export default async function EditTechnologyPage({
  params,
}) {
  const { id } = await params;

  const technologyId =
    Number(id);

  if (
    !Number.isInteger(
      technologyId
    )
  ) {
    notFound();
  }

  const technology =
    await prisma.technology.findUnique({
      where: {
        id: technologyId,
      },
    });

  if (!technology) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link
        href="/admin/technologies"
        className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Technologies
      </Link>

      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Editing Technology
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          {technology.name}
        </h1>
      </div>

      <TechnologyForm
        technology={technology}
      />
    </section>
  );
}
