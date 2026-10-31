"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  createTestimonial,
  updateTestimonial,
} from "@/actions/testimonials";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

function ErrorText({ error }) {
  if (!error?.length) {
    return null;
  }

  return (
    <p className="mt-1 text-xs text-red-400">
      {error[0]}
    </p>
  );
}

export default function TestimonialForm({
  testimonial,
  projects = [],
}) {
  const action = testimonial
    ? updateTestimonial.bind(
        null,
        testimonial.id
      )
    : createTestimonial;

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
            Client Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Information about the client
            who provided this testimonial.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Client Name *
            </label>

            <input
              name="clientName"
              required
              defaultValue={
                testimonial?.clientName ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors?.clientName
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Role / Position
            </label>

            <input
              name="clientRole"
              placeholder="CEO, Project Manager..."
              defaultValue={
                testimonial?.clientRole ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Company
            </label>

            <input
              name="company"
              defaultValue={
                testimonial?.company ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Avatar URL
            </label>

            <input
              name="avatarUrl"
              defaultValue={
                testimonial?.avatarUrl ??
                ""
              }
              placeholder="Optional"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Testimonial
          </h2>
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Client Feedback *
          </label>

          <textarea
            name="quote"
            required
            rows={6}
            defaultValue={
              testimonial?.quote ?? ""
            }
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
          />

          <ErrorText
            error={
              state.errors?.quote
            }
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Rating
            </label>

            <select
              name="rating"
              defaultValue={
                testimonial?.rating ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            >
              <option value="">
                No rating
              </option>

              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Related Project
            </label>

            <select
              name="projectId"
              defaultValue={
                testimonial?.projectId ??
                ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            >
              <option value="">
                No specific project
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.title}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Sort Order
            </label>

            <input
              type="number"
              min="0"
              name="sortOrder"
              defaultValue={
                testimonial?.sortOrder ??
                0
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked={
                  testimonial?.isVisible ??
                  true
                }
              />

              <span className="text-sm text-neutral-300">
                Visible on portfolio
              </span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
        <Link
          href="/admin/testimonials"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 hover:bg-white/5"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-50"
        >
          {pending
            ? "Saving..."
            : testimonial
              ? "Update Testimonial"
              : "Create Testimonial"}
        </button>
      </div>
    </form>
  );
}