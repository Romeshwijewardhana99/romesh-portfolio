import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

export default function FeaturedProjects({
  projects,
}) {
  if (!projects.length) {
    return null;
  }

  return (
    <section
      id="work"
      className="bg-neutral-950 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
              Selected Work
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Projects built to
              solve real problems.
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white"
          >
            View all projects
            <ArrowUpRight
              size={16}
            />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map(
            (project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
                  {project.coverImage ? (
                    <Image
                      src={
                        project.coverImage
                      }
                      alt={
                        project.title
                      }
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600">
                      Project Preview
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500">
                        {project.projectType ||
                          "Project"}
                      </p>

                      <h3 className="mt-2 text-2xl font-medium">
                        {
                          project.title
                        }
                      </h3>
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="mt-2 shrink-0 text-neutral-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">
                    {
                      project.shortDescription
                    }
                  </p>

                  {project
                    .technologies
                    .length >
                    0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map(
                        ({
                          technology,
                        }) => (
                          <span
                            key={
                              technology.id
                            }
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400"
                          >
                            {
                              technology.name
                            }
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}