import Link from "next/link";
import {
  Plus,
  Pencil,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

function getStatusClasses(
  status
) {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "ARCHIVED":
      return "border-neutral-500/20 bg-neutral-500/10 text-neutral-400";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
}

export default async function ProjectsPage() {
  const projects =
    await prisma.project.findMany({
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
            Portfolio Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Projects
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage case studies and
            portfolio projects.
          </p>
        </div>

        <Link
          href="/admin/projects/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          <Plus size={17} />

          New Project
        </Link>
      </div>

      {projects.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">
            No projects yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Create your first
            portfolio project.
          </p>

          <Link
            href="/admin/projects/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            <Plus size={17} />

            Create Project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[1fr_140px_120px_250px] border-b border-white/10 bg-white/[0.025] px-5 py-3 text-xs uppercase tracking-wider text-neutral-500 md:grid">
            <div>
              Project
            </div>

            <div>
              Status
            </div>

            <div>
              Order
            </div>

            <div className="text-right">
              Actions
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {projects.map(
              (project) => (
                <div
                  key={
                    project.id
                  }
                  className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_140px_120px_250px] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-medium text-white">
                        {
                          project.title
                        }
                      </h2>

                      {project.featured && (
                        <Star
                          size={
                            15
                          }
                          className="shrink-0"
                        />
                      )}
                    </div>

                    <p className="mt-1 truncate text-sm text-neutral-500">
                      /
                      {
                        project.slug
                      }
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        project.status
                      )}`}
                    >
                      {
                        project.status
                      }
                    </span>
                  </div>

                  <div className="text-sm text-neutral-400">
                    {
                      project.sortOrder
                    }
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Pencil
                        size={
                          15
                        }
                      />

                      Edit
                    </Link>

                    <DeleteProjectButton
                      projectId={
                        project.id
                      }
                      projectTitle={
                        project.title
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}