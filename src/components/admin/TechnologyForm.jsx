"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  createTechnology,
  updateTechnology,
} from "@/actions/technologies";

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

export default function TechnologyForm({
  technology,
}) {
  const action = technology
    ? updateTechnology.bind(
        null,
        technology.id
      )
    : createTechnology;

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
          Technology Name *
        </label>

        <input
          name="name"
          required
          defaultValue={
            technology?.name ?? ""
          }
          placeholder="Next.js"
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />

        <ErrorText
          error={state.errors?.name}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Slug
        </label>

        <input
          name="slug"
          defaultValue={
            technology?.slug ?? ""
          }
          placeholder="next-js"
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />

        <p className="mt-1 text-xs text-neutral-600">
          Leave empty to generate
          automatically.
        </p>

        <ErrorText
          error={state.errors?.slug}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Category
        </label>

        <select
          name="category"
          defaultValue={
            technology?.category ??
            "OTHER"
          }
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
        >
          <option value="FRONTEND">
            Frontend
          </option>

          <option value="BACKEND">
            Backend
          </option>

          <option value="DATABASE">
            Database
          </option>

          <option value="MOBILE">
            Mobile
          </option>

          <option value="DEVOPS">
            DevOps
          </option>

          <option value="TOOL">
            Tool
          </option>

          <option value="OTHER">
            Other
          </option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Icon
        </label>

        <input
          name="icon"
          defaultValue={
            technology?.icon ?? ""
          }
          placeholder="Optional icon reference"
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral-300">
          Sort Order
        </label>

        <input
          type="number"
          name="sortOrder"
          min="0"
          defaultValue={
            technology?.sortOrder ??
            0
          }
          className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3">
        <input
          type="checkbox"
          name="isVisible"
          defaultChecked={
            technology?.isVisible ??
            true
          }
        />

        <span className="text-sm text-neutral-300">
          Visible on portfolio
        </span>
      </label>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
        <Link
          href="/admin/technologies"
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
            : technology
              ? "Update Technology"
              : "Create Technology"}
        </button>
      </div>
    </form>
  );
}