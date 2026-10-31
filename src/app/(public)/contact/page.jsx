import {
  Mail,
  MapPin,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import ProjectInquiryForm from "@/components/public/ProjectInquiryForm";

export const metadata = {
  title:
    "Contact | Romesh Portfolio",

  description:
    "Discuss a website, web application, business system or custom software project.",
};

export default async function ContactPage() {
  const [
    services,
    settings,
  ] = await Promise.all([
    prisma.service.findMany({
      where: {
        isVisible: true,
      },

      select: {
        id: true,
        title: true,
      },

      orderBy: {
        sortOrder: "asc",
      },
    }),

    prisma.siteSetting.findFirst(),
  ]);

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Start a Project
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Have an idea?
            <br />
            Let&apos;s build it.
          </h1>

          <p className="mt-6 max-w-md leading-7 text-neutral-500">
            Tell me about your project,
            business problem or existing
            system. I&apos;ll review the
            requirements and get back to
            you.
          </p>

          <div className="mt-10 space-y-4">
            {settings?.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail
                  size={18}
                  className="text-neutral-500"
                />

                <span>
                  {
                    settings.email
                  }
                </span>
              </div>
            )}

            {settings?.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin
                  size={18}
                  className="text-neutral-500"
                />

                <span>
                  {
                    settings.location
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 p-6 sm:p-8 dark:border-white/10">
          <ProjectInquiryForm
            services={services}
          />
        </div>
      </div>
    </main>
  );
}