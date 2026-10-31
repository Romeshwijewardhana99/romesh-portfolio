"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";

import {
  Send,
  CheckCircle2,
} from "lucide-react";

import {
  createInquiry,
} from "@/actions/inquiries";

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
    <p className="mt-1 text-sm text-red-400">
      {error[0]}
    </p>
  );
}

export default function ProjectInquiryForm({
  services = [],
}) {
  const formRef =
    useRef(null);

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    createInquiry,
    initialState
  );

  useEffect(() => {
    if (
      state.success &&
      formRef.current
    ) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6"
    >
      {state.message && (
        <div
          className={`rounded-2xl border px-5 py-4 ${
            state.success
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          <div className="flex gap-3">
            {state.success && (
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="text-sm">
              {state.message}
            </p>
          </div>
        </div>
      )}

      {/* Spam honeypot */}
      <div
        aria-hidden="true"
        className="hidden"
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">
            Your Name *
          </label>

          <input
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900 dark:border-white/10 dark:focus:border-white/40"
          />

          <ErrorText
            error={
              state.errors?.name
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Email *
          </label>

          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900 dark:border-white/10 dark:focus:border-white/40"
          />

          <ErrorText
            error={
              state.errors?.email
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900 dark:border-white/10 dark:focus:border-white/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Company /
            Organization
          </label>

          <input
            name="company"
            autoComplete="organization"
            className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900 dark:border-white/10 dark:focus:border-white/40"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm">
          What do you need?
        </label>

        <select
          name="service"
          defaultValue=""
          className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none dark:border-white/10 dark:bg-neutral-950"
        >
          <option value="">
            Select a service
          </option>

          {services.map(
            (service) => (
              <option
                key={service.id}
                value={
                  service.title
                }
              >
                {service.title}
              </option>
            )
          )}

          <option value="Other">
            Other / Not sure
          </option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">
            Estimated Budget
          </label>

          <select
            name="budget"
            defaultValue=""
            className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none dark:border-white/10 dark:bg-neutral-950"
          >
            <option value="">
              Not sure yet
            </option>

            <option value="Under $500">
              Under $500
            </option>

            <option value="$500 - $1,000">
              $500 – $1,000
            </option>

            <option value="$1,000 - $3,000">
              $1,000 – $3,000
            </option>

            <option value="$3,000+">
              $3,000+
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Expected Timeline
          </label>

          <select
            name="timeline"
            defaultValue=""
            className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none dark:border-white/10 dark:bg-neutral-950"
          >
            <option value="">
              Flexible / Not sure
            </option>

            <option value="As soon as possible">
              As soon as possible
            </option>

            <option value="Within 1 month">
              Within 1 month
            </option>

            <option value="1 - 3 months">
              1 – 3 months
            </option>

            <option value="3+ months">
              3+ months
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm">
          Tell me about your project *
        </label>

        <textarea
          name="message"
          required
          rows={7}
          placeholder="What are you trying to build? What problem should it solve?"
          className="w-full resize-none rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900 dark:border-white/10 dark:focus:border-white/40"
        />

        <ErrorText
          error={
            state.errors?.message
          }
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:w-auto"
      >
        <Send size={17} />

        {pending
          ? "Sending..."
          : "Send Project Inquiry"}
      </button>
    </form>
  );
}