import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";

export default function Hero({
  settings,
}) {
  const title =
    settings?.heroTitle ||
    "I build modern digital products that solve real business problems.";

  const subtitle =
    settings?.heroSubtitle ||
    "Full-stack developer creating modern web applications, business systems and reliable digital solutions.";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-neutral-100 blur-3xl dark:bg-white/[0.03]" />

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-7 flex flex-wrap items-center gap-3">
            {settings?.availableForWork && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                {settings?.heroBadge ||
                  "Available for freelance projects"}
              </span>
            )}

            {settings?.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                <MapPin size={13} />

                {
                  settings.location
                }
              </span>
            )}
          </div>

          <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Full-Stack Developer
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg dark:text-neutral-400">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black"
            >
              Start a Project
              <ArrowRight
                size={16}
              />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/5"
            >
              View My Work
              <ArrowDownRight
                size={16}
              />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-8 -z-10 rounded-full bg-neutral-100 blur-3xl dark:bg-white/[0.04]" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900">
            {settings?.profileImage ? (
              <Image
                src={
                  settings.profileImage
                }
                alt={
                  settings.siteName ||
                  "Profile image"
                }
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 420px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                Profile image
              </div>
            )}

            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/40 p-4 text-white backdrop-blur-xl">
              <p className="text-xs uppercase tracking-wider text-white/60">
                Focus
              </p>

              <p className="mt-1 text-sm font-medium">
                Full-Stack Web
                Applications &
                Business Systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}