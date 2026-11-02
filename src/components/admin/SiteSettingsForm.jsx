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
      aria-busy={pending}
      className="space-y-8"
    >
      {state.message && (
        <div
          role={state.success ? "status" : "alert"}
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
            availability.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="settings-siteName" className="mb-2 block text-sm text-neutral-300">
              Site Name *
            </label>

            <input
              id="settings-siteName" name="siteName"
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
            <label htmlFor="settings-heroBadge" className="mb-2 block text-sm text-neutral-300">
              Hero Badge
            </label>

            <input
              id="settings-heroBadge" name="heroBadge"
              defaultValue={
                settings?.heroBadge ??
                ""
              }
              placeholder="Available for freelance projects"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
            <ErrorText error={state.errors?.heroBadge} />
          </div>

          <div>
            <label htmlFor="settings-heroTitle" className="mb-2 block text-sm text-neutral-300">
              Hero Title
            </label>

            <textarea
              id="settings-heroTitle" name="heroTitle"
              rows={3}
              defaultValue={
                settings?.heroTitle ??
                ""
              }
              placeholder="I build digital products that solve real business problems."
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
            <ErrorText error={state.errors?.heroTitle} />
          </div>

          <div>
            <label htmlFor="settings-heroSubtitle" className="mb-2 block text-sm text-neutral-300">
              Hero Subtitle
            </label>

            <textarea
              id="settings-heroSubtitle" name="heroSubtitle"
              rows={4}
              defaultValue={
                settings?.heroSubtitle ??
                ""
              }
              placeholder="Full-stack developer specializing in..."
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
            <ErrorText error={state.errors?.heroSubtitle} />
          </div>


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
            <label htmlFor="settings-email" className="mb-2 block text-sm text-neutral-300">
              Email
            </label>

            <input
              type="email"
              id="settings-email" name="email"
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
            <label htmlFor="settings-phone" className="mb-2 block text-sm text-neutral-300">
              Phone
            </label>

            <input
              id="settings-phone" name="phone"
              defaultValue={
                settings?.phone ?? ""
              }
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
            <ErrorText error={state.errors?.phone} />
          </div>

          <div>
            <label htmlFor="settings-whatsapp" className="mb-2 block text-sm text-neutral-300">
              WhatsApp
            </label>

            <input
              id="settings-whatsapp" name="whatsapp"
              defaultValue={
                settings?.whatsapp ??
                ""
              }
              placeholder="+94..."
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
            <ErrorText error={state.errors?.whatsapp} />
          </div>

          <div>
            <label htmlFor="settings-location" className="mb-2 block text-sm text-neutral-300">
              Location
            </label>

            <input
              id="settings-location" name="location"
              defaultValue={
                settings?.location ??
                ""
              }
              placeholder="Sri Lanka"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-white/30"
            />
            <ErrorText error={state.errors?.location} />
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
                <label htmlFor="settings-resumeUrl" className="mb-2 block text-sm text-neutral-300">
                  {label}
                </label>

                <input
                  type="url"
                  id={`settings-${name}`}
                  name={name}
                  defaultValue={
                    settings?.[
                      name
                    ] ?? ""
                  }
                  placeholder="/resume/romesh-wijewardhana.pdf or https://..."
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

      {/* PROFILE */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="mb-6"><h2 className="text-lg font-medium">Profile</h2>
          <p className="mt-1 text-sm text-neutral-500">Profile image changes save immediately. Save Settings to update your resume link.</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm text-neutral-300">
              Profile Image
            </label>

            <ProfileImageUploader
              initialUrl={
                settings?.profileImage ??
                ""
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Resume URL
            </label>

            <input
              type="text"
              id="settings-resumeUrl" name="resumeUrl"
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
            <label htmlFor="settings-seoTitle" className="mb-2 block text-sm text-neutral-300">
              SEO Title
            </label>

            <input
              id="settings-seoTitle" name="seoTitle"
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
            <label htmlFor="settings-seoDescription" className="mb-2 block text-sm text-neutral-300">
              SEO Description
            </label>

            <textarea
              id="settings-seoDescription" name="seoDescription"
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