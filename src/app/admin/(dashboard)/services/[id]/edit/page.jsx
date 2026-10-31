import Link from "next/link";
import {
  notFound,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}) {
  const { id } = await params;

  const serviceId = Number(id);

  if (!Number.isInteger(serviceId)) {
    notFound();
  }

  const service =
    await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

  if (!service) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/admin/services"
        className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Services
      </Link>

      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Editing Service
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          {service.title}
        </h1>
      </div>

      <ServiceForm
        service={service}
      />
    </section>
  );
}