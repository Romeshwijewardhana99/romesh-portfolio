import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

export default function CTASection({
  availableForWork,
}) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-neutral-950 px-7 py-14 text-white sm:px-12 sm:py-16">
        <div className="max-w-3xl">
          {availableForWork && (
            <p className="mb-5 text-sm text-emerald-400">
              ● Available for new
              freelance projects
            </p>
          )}

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Have a project that
            needs more than just
            code?
          </h2>

          <p className="mt-6 max-w-xl leading-7 text-neutral-400">
            Tell me what you&apos;re
            trying to build and the
            problem you&apos;re
            trying to solve.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black"
          >
            Discuss Your Project

            <ArrowUpRight
              size={16}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}