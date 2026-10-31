"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  createService,
  updateService,
} from "@/actions/services";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

function ErrorText({ error }) {
  if (!error?.length) return null;

  return (
    <p className="mt-1 text-xs text-red-400">
      {error[0]}
    </p>
  );
}

export default function ServiceForm({
  service,
}) {
  const action = service
    ? updateService.bind(
        null,
        service.id
      )
    : createService;

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
      className="space-y-6"
    >
      {state.message && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Service Title *
        </label>

        <input
          name="title"
          required
          defaultValue={
            service?.title ?? ""
          }
          placeholder="Web Application Development"
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />

        <ErrorText
          error={state.errors?.title}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Slug
        </label>

        <input
          name="slug"
          defaultValue={
            service?.slug ?? ""
          }
          placeholder="web-application-development"
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />

        <p className="mt-1 text-xs text-neutral-600">
          Leave empty to generate
          automatically.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Short Description *
        </label>

        <textarea
          name="shortDescription"
          rows={3}
          required
          maxLength={500}
          defaultValue={
            service?.shortDescription ??
            ""
          }
          className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />

        <ErrorText
          error={
            state.errors?.shortDescription
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Full Description
        </label>

        <textarea
          name="description"
          rows={7}
          defaultValue={
            service?.description ?? ""
          }
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Icon
          </label>

          <input
            name="icon"
            defaultValue={
              service?.icon ?? ""
            }
            placeholder="code-2"
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
          />

          <p className="mt-1 text-xs text-neutral-600">
            අපි පස්සේ Lucide icon mapping
            එකක් දාමු.
          </p>
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
              service?.sortOrder ?? 0
            }
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3">
        <input
          type="checkbox"
          name="isVisible"
          defaultChecked={
            service?.isVisible ?? true
          }
        />

        <span className="text-sm text-neutral-300">
          Visible on public portfolio
        </span>
      </label>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
        <Link
          href="/admin/services"
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
            : service
              ? "Update Service"
              : "Create Service"}
        </button>
      </div>
    </form>
  );
}