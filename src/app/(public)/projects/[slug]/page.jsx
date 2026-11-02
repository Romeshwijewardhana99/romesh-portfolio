import TechnologyIcon from "@/components/public/TechnologyIcon";
import Image from "next/image";
import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,

  Quote,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import { prisma } from "@/lib/prisma";

async function getProject(slug) {
  return prisma.project.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      technologies: {
        include: {
          technology: true,
        },
      },

      testimonials: {
        where: {
          isVisible: true,
        },

        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const project =
    await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,

    description:
      project.shortDescription,

    openGraph: {
      title: project.title,

      description:
        project.shortDescription,

      images: project.coverImage
        ? [
            {
              url: project.coverImage,
            },
          ]
        : [],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}) {
  const { slug } = await params;

  const project =
    await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      {/* HERO */}

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black dark:hover:text-white"
          >
            <ArrowLeft size={16} />

            All Projects
          </Link>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
                {project.projectType ||
                  "Case Study"}
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-500">
                {
                  project.shortDescription
                }
              </p>
            </div>

            <div className="space-y-6 lg:border-l lg:border-neutral-200 lg:pl-8 dark:lg:border-white/10">
              {project.clientName && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-400">
                    Client
                  </p>

                  <p className="mt-2 text-sm">
                    {
                      project.clientName
                    }
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400">
                  Technology
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
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
              </div>

              {(project.liveUrl ||
                project.githubUrl) && (
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a
                      href={
                        project.liveUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm text-white dark:bg-white dark:text-black"
                    >
                      Live Project

                      <ArrowUpRight
                        size={15}
                      />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={
                        project.githubUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm dark:border-white/10"
                    >
                      <FaGithub
                        size={15}
                      />

                      Source
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COVER */}

      {project.coverImage && (
        <section className="px-6">
          <div className="relative mx-auto aspect-[16/8] max-w-7xl overflow-hidden rounded-[2rem] bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={
                project.coverImage
              }
              alt={
                project.title
              }
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>
      )}

      {/* OVERVIEW */}

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
              Overview
            </p>
          </div>

          <div className="max-w-3xl whitespace-pre-line text-lg leading-9 text-neutral-600 dark:text-neutral-300">
            {project.description}
          </div>
        </div>
      </section>

      {/* PROBLEM */}

      {project.problem && (
        <CaseSection
          number="01"
          title="The Problem"
          content={
            project.problem
          }
        />
      )}

      {/* SOLUTION */}

      {project.solution && (
        <CaseSection
          number="02"
          title="The Solution"
          content={
            project.solution
          }
          dark
        />
      )}

      {/* CHALLENGES */}

      {project.challenges && (
        <CaseSection
          number="03"
          title="Challenges"
          content={
            project.challenges
          }
        />
      )}

      {/* GALLERY */}

      {project.images.length >
        0 && (
        <section className="bg-neutral-100 px-6 py-24 dark:bg-white/[0.025]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Interface
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                Product visuals.
              </h2>
            </div>

            <div className="space-y-6">
              {project.images.map(
                (image) => (
                  <figure
                    key={
                      image.id
                    }
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
                      <Image
                        src={
                          image.imageUrl
                        }
                        alt={
                          image.altText ||
                          project.title
                        }
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>

                    {image.caption && (
                      <figcaption className="mt-3 text-sm text-neutral-500">
                        {
                          image.caption
                        }
                      </figcaption>
                    )}
                  </figure>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* OUTCOME */}

      {project.outcome && (
        <CaseSection
          number="04"
          title="Outcome"
          content={
            project.outcome
          }
        />
      )}

      {/* TESTIMONIAL */}

      {project.testimonials
        .length > 0 && (
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            {project.testimonials.map(
              (
                testimonial
              ) => (
                <blockquote
                  key={
                    testimonial.id
                  }
                  className="text-center"
                >
                  <Quote
                    size={32}
                    className="mx-auto text-neutral-300 dark:text-neutral-700"
                  />

                  <p className="mt-8 text-2xl leading-10 tracking-tight sm:text-3xl">
                    “
                    {
                      testimonial.quote
                    }
                    ”
                  </p>

                  <footer className="mt-7">
                    <p className="font-medium">
                      {
                        testimonial.clientName
                      }
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      {[
                        testimonial.clientRole,
                        testimonial.company,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " · "
                        )}
                    </p>
                  </footer>
                </blockquote>
              )
            )}
          </div>
        </section>
      )}

      {/* CTA */}

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-neutral-950 px-7 py-14 text-white sm:px-12 sm:py-16">
          <p className="text-sm text-neutral-400">
            Have a similar project?
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s build something
            that solves the real
            problem.
          </h2>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
          >
            Start a Project

            <ArrowUpRight
              size={16}
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

function CaseSection({
  number,
  title,
  content,
  dark = false,
}) {
  return (
    <section
      className={`px-6 py-24 ${
        dark
          ? "bg-neutral-950 text-white"
          : "border-t border-neutral-200 dark:border-white/10"
      }`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <span
            className={`text-sm ${
              dark
                ? "text-neutral-600"
                : "text-neutral-400"
            }`}
          >
            {number}
          </span>

          <h2 className="mt-3 text-2xl font-medium">
            {title}
          </h2>
        </div>

        <div
          className={`max-w-3xl whitespace-pre-line text-lg leading-9 ${
            dark
              ? "text-neutral-400"
              : "text-neutral-600 dark:text-neutral-300"
          }`}
        >
          {content}
        </div>
      </div>
    </section>
  );
}