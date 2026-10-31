import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";
import DeleteTechnologyButton from "@/components/admin/DeleteTechnologyButton";

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Portfolio Content</p>
          <h1 className="mt-1 text-3xl font-semibold">Technologies</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Manage the technologies used across your projects.
          </p>
        </div>
        <Link
          href="/admin/technologies/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
        >
          <Plus size={17} />
          New Technology
        </Link>
      </div>

      {technologies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">No technologies yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Add React, Next.js, MySQL and your other tools.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[1fr_160px_120px_120px_180px] border-b border-white/10 bg-white/[0.025] px-5 py-3 text-xs uppercase tracking-wider text-neutral-500 md:grid">
            <div>Name</div>
            <div>Category</div>
            <div>Projects</div>
            <div>Visible</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-white/10">
            {technologies.map((technology) => (
              <div
                key={technology.id}
                className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_160px_120px_120px_180px] md:items-center"
              >
                <div>
                  <p className="font-medium">{technology.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">/{technology.slug}</p>
                </div>
                <div className="text-sm text-neutral-400">{technology.category}</div>
                <div className="text-sm text-neutral-400">{technology._count.projects}</div>
                <div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      technology.isVisible
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                    }`}
                  >
                    {technology.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-2 md:justify-end">
                  <Link
                    href={`/admin/technologies/${technology.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>
                  <DeleteTechnologyButton
                    technologyId={technology.id}
                    technologyName={technology.name}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
