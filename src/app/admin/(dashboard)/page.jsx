import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    projects,
    inquiries,
    services,
    technologies,
  ] = await Promise.all([
    prisma.project.count(),

    prisma.inquiry.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.service.count(),

    prisma.technology.count(),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projects,
    },
    {
      label: "New Inquiries",
      value: inquiries,
    },
    {
      label: "Services",
      value: services,
    },
    {
      label: "Technologies",
      value: technologies,
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Overview
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="text-sm text-neutral-400">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}