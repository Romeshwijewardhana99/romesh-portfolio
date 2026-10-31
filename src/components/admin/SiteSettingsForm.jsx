"use client";

import {
  useActionState,
} from "react";

import {
  Save,
} from "lucide-react";

import {
  updateSiteSettings,
} from "@/actions/site-settings";

import ProfileImageUploader from "@/components/admin/ProfileImageUploader";

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

export default function SiteSettingsForm({
  settings,
}) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    updateSiteSettings,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {state.message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* GENERAL */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            General
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Portfolio identity and
            profile information.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Site Name *
            </label>

            <input
              name="siteName"
              required
              defaultValue={
                settings?.siteName ??
                "Romesh Portfolio"
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors?.siteName
              }
            />
          </div>

          <div>
            <label className="mb-3 block text-sm text-neutral-300">
              Profile Image
            </label>

            <ProfileImageUploader
              initialUrl={
                settings?.profileImage ??
                ""
              }
              initialPublicId={
                settings?.profileImagePublicId ??
                ""
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Resume URL
            </label>

            <input
              type="url"
              name="resumeUrl"
              defaultValue={
                settings?.resumeUrl ??
                ""
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors?.resumeUrl
              }
            />
          </div>
        </div>
      </section>

      {/* HERO */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Hero Section
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Main message visitors see
            when they enter your
            portfolio.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Hero Badge
            </label>

            <input
              name="heroBadge"
              defaultValue={
                settings?.heroBadge ??
                ""
              }
              placeholder="Available for freelance projects"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Hero Title
            </label>

            <textarea
              name="heroTitle"
              rows={3}
              defaultValue={
                settings?.heroTitle ??
                ""
              }
              placeholder="I build digital products that solve real business problems."
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Hero Subtitle
            </label>

            <textarea
              name="heroSubtitle"
              rows={4}
              defaultValue={
                settings?.heroSubtitle ??
                ""
              }
              placeholder="Full-stack developer specializing in..."
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3">
            <input
              type="checkbox"
              name="availableForWork"
              defaultChecked={
                settings?.availableForWork ??
                true
              }
            />

            <div>
              <p className="text-sm text-neutral-200">
                Available for work
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Show visitors that you
                are accepting freelance
                projects.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* CONTACT */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              defaultValue={
                settings?.email ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors?.email
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Phone
            </label>

            <input
              name="phone"
              defaultValue={
                settings?.phone ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              WhatsApp
            </label>

            <input
              name="whatsapp"
              defaultValue={
                settings?.whatsapp ??
                ""
              }
              placeholder="+94..."
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Location
            </label>

            <input
              name="location"
              defaultValue={
                settings?.location ??
                ""
              }
              placeholder="Sri Lanka"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>
        </div>
      </section>

      {/* SOCIAL */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Social Links
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            [
              "githubUrl",
              "GitHub",
            ],
            [
              "linkedinUrl",
              "LinkedIn",
            ],
            [
              "facebookUrl",
              "Facebook",
            ],
            [
              "instagramUrl",
              "Instagram",
            ],
          ].map(
            ([name, label]) => (
              <div key={name}>
                <label className="mb-2 block text-sm text-neutral-300">
                  {label}
                </label>

                <input
                  type="url"
                  name={name}
                  defaultValue={
                    settings?.[
                      name
                    ] ?? ""
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
                />

                <ErrorText
                  error={
                    state.errors?.[
                      name
                    ]
                  }
                />
              </div>
            )
          )}
        </div>
      </section>

      {/* SEO */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            SEO
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Search engine title and
            description for your
            portfolio.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              SEO Title
            </label>

            <input
              name="seoTitle"
              maxLength={70}
              defaultValue={
                settings?.seoTitle ??
                ""
              }
              placeholder="Full-Stack Developer | Web Applications & Business Systems"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors?.seoTitle
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              SEO Description
            </label>

            <textarea
              name="seoDescription"
              rows={4}
              maxLength={170}
              defaultValue={
                settings?.seoDescription ??
                ""
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />

            <ErrorText
              error={
                state.errors
                  ?.seoDescription
              }
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black shadow-xl disabled:opacity-50"
        >
          <Save size={17} />

          {pending
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>
    </form>
  );
}