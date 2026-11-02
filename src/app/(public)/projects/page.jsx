import TechnologyIcon from "@/components/public/TechnologyIcon";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Projects",
  description:
    "Selected web applications, business systems and full-stack development projects.",
};

export default async function ProjectsPage() {
  const projects =
    await prisma.project.findMany({
      where: {
        status: "PUBLISHED",
      },

      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          publishedAt: "desc",
        },
      ],
    });

  return (
    <main>
      <section className="border-b border-neutral-200 px-6 py-20 dark:border-white/10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
            Selected Work
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Projects built around
            real problems.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
            A selection of web
            applications, business
            systems and digital
            products I&apos;ve designed
            and developed.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 py-20 text-center dark:border-white/10">
              <h2 className="text-xl font-medium">
                Projects coming soon.
              </h2>

              <p className="mt-2 text-neutral-500">
                Published projects will
                appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 lg:grid-cols-2">
              {projects.map(
                (project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900">
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
                        <div className="flex h-full items-center justify-center text-neutral-400">
                          Project Preview
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                            {project.projectType ||
                              "Project"}
                          </p>

                          <h2 className="mt-2 text-2xl font-medium tracking-tight">
                            {
                              project.title
                            }
                          </h2>
                        </div>

                        <ArrowUpRight
                          size={20}
                          className="mt-2 shrink-0 text-neutral-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black dark:group-hover:text-white"
                        />
                      </div>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
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
                                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 dark:border-white/10"
                              >
                                <TechnologyIcon name={technology.name} />
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
          )}
        </div>
      </section>
    </main>
  );
}