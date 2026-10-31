import Link from "next/link";
import {
  ArrowLeft,
} from "lucide-react";

import ProjectForm from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

export default async function CreateProjectPage() {
  const technologies = await prisma.technology.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
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
          Portfolio Content
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Create Project
        </h1>
      </div>

      <ProjectForm technologies={technologies} />
    </section>
  );
}
