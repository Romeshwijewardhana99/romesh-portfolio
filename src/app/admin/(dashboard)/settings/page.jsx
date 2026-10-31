import { prisma } from "@/lib/prisma";

import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function SettingsPage() {
  const settings =
    await prisma.siteSetting.findUnique({
      where: {
        id: 1,
      },
    });

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Portfolio Configuration
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Site Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Manage global portfolio
          content, contact information,
          social links and SEO settings.
        </p>
      </div>

      <SiteSettingsForm
        settings={settings}
      />
    </section>
  );
}