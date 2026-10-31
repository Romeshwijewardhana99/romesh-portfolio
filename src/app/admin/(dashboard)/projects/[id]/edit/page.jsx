import Link from "next/link";
import {
  notFound,
} from "next/navigation";
import {
  ArrowLeft,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectGalleryManager from "@/components/admin/ProjectGalleryManager";

export default async function EditProjectPage({
  params,
}) {
  const { id } = await params;

  const projectId =
    Number(id);

  if (
    !Number.isInteger(
      projectId
    )
  ) {
    notFound();
  }

  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        technologies: { select: { technologyId: true } },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

  if (!project) {
    notFound();
  }

  const technologies = await prisma.technology.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const projectForForm = {
    ...project,
    technologyIds: project.technologies.map((item) => item.technologyId),
  };

  return (
    <section className="mx-auto max-w-5xl">
      <Link
        href="/admin/projects"
        className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Editing Project
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          {project.title}
        </h1>
      </div>

      <ProjectForm
        project={projectForForm}
        technologies={technologies}
      />
      <div className="mt-8">
        <ProjectGalleryManager
          projectId={project.id}
          images={project.images}
        />
      </div>
    </section>
  );
}
