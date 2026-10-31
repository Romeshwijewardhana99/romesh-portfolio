"use client";

import {
  useActionState,
} from "react";
import Link from "next/link";
import CoverImageUploader from "@/components/admin/CoverImageUploader";

import {
  createProject,
  updateProject,
} from "@/actions/projects";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

function ErrorText({
  error,
}) {
  if (!error?.length) {
    return null;
  }

  return (
    <p className="mt-1 text-xs text-red-400">
      {error[0]}
    </p>
  );
}

export default function ProjectForm({
  project,
  technologies = [],
}) {
  const action = project
    ? updateProject.bind(
        null,
        project.id
      )
    : createProject;

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    action,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {state.message && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Main information shown
            throughout the portfolio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-neutral-300">
              Project Title *
            </label>

            <input
              type="text"
              name="title"
              required
              defaultValue={
                project?.title ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors?.title
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-neutral-300">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              defaultValue={
                project?.slug ?? ""
              }
              placeholder="police-athletics-management"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />

            <p className="mt-1 text-xs text-neutral-600">
              Leave empty to generate
              automatically from title.
            </p>

            <ErrorText
              error={
                state.errors?.slug
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-neutral-300">
              Short Description *
            </label>

            <textarea
              name="shortDescription"
              rows={3}
              required
              maxLength={500}
              defaultValue={
                project?.shortDescription ??
                ""
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors
                  ?.shortDescription
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Client Name
            </label>

            <input
              name="clientName"
              defaultValue={
                project?.clientName ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Project Type
            </label>

            <input
              name="projectType"
              placeholder="Web Application"
              defaultValue={
                project?.projectType ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Case Study
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Explain the problem,
            solution and result.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Main Description *
            </label>

            <textarea
              name="description"
              rows={6}
              required
              defaultValue={
                project?.description ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors
                  ?.description
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Problem
            </label>

            <textarea
              name="problem"
              rows={4}
              defaultValue={
                project?.problem ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Solution
            </label>

            <textarea
              name="solution"
              rows={4}
              defaultValue={
                project?.solution ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Challenges
            </label>

            <textarea
              name="challenges"
              rows={4}
              defaultValue={
                project?.challenges ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Outcome
            </label>

            <textarea
              name="outcome"
              rows={4}
              defaultValue={
                project?.outcome ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Links & Media
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-3 block text-sm text-neutral-300">
              Cover Image
            </label>

            <CoverImageUploader
              initialUrl={project?.coverImage ?? ""}
              initialPublicId={project?.coverImagePublicId ?? ""}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Live URL
            </label>

            <input
              type="text"
              name="liveUrl"
              defaultValue={
                project?.liveUrl ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              GitHub URL
            </label>

            <input
              type="text"
              name="githubUrl"
              defaultValue={
                project?.githubUrl ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Technologies
          </h2>
      
          <p className="mt-1 text-sm text-neutral-500">
            Select the technologies used
            in this project.
          </p>
        </div>
      
        {technologies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-neutral-500">
            No technologies available.
            Add technologies from the
            Technologies section first.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map(
              (technology) => {
                const selected =
                  project?.technologyIds?.includes(
                    technology.id
                  ) ?? false;
      
                return (
                  <label
                    key={technology.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 transition hover:border-white/20"
                  >
                    <input
                      type="checkbox"
                      name="technologyIds"
                      value={technology.id}
                      defaultChecked={
                        selected
                      }
                    />
      
                    <div>
                      <p className="text-sm text-neutral-200">
                        {
                          technology.name
                        }
                      </p>
      
                      <p className="text-xs text-neutral-600">
                        {
                          technology.category
                        }
                      </p>
                    </div>
                  </label>
                );
              }
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Publishing
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Status
            </label>

            <select
              name="status"
              defaultValue={
                project?.status ??
                "DRAFT"
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Sort Order
            </label>

            <input
              type="number"
              min="0"
              name="sortOrder"
              defaultValue={
                project?.sortOrder ??
                0
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={
                  project?.featured ??
                  false
                }
                className="h-4 w-4"
              />

              <span className="text-sm text-neutral-300">
                Featured Project
              </span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin/projects"
          className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm text-neutral-300 transition hover:bg-white/5"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending
            ? "Saving..."
            : project
              ? "Update Project"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
}
