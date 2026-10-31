import Link from "next/link";
import {
  Plus,
  Pencil,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";

export default async function ServicesPage() {
  const services =
    await prisma.service.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          title: "asc",
        },
      ],
    });

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            Portfolio Content
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Services
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage the services shown
            to potential clients.
          </p>
        </div>

        <Link
          href="/admin/services/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
        >
          <Plus size={17} />
          New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">
            No services yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Add the services you offer
            to freelance clients.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[1fr_120px_100px_190px] border-b border-white/10 bg-white/[0.025] px-5 py-3 text-xs uppercase tracking-wider text-neutral-500 md:grid">
            <div>Service</div>
            <div>Order</div>
            <div>Visible</div>
            <div className="text-right">
              Actions
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {services.map(
              (service) => (
                <div
                  key={service.id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_120px_100px_190px] md:items-center"
                >
                  <div>
                    <p className="font-medium">
                      {service.title}
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      /{service.slug}
                    </p>

                    <p className="mt-2 line-clamp-1 text-sm text-neutral-600">
                      {
                        service.shortDescription
                      }
                    </p>
                  </div>

                  <div className="text-sm text-neutral-400">
                    {service.sortOrder}
                  </div>

                  <div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs ${
                        service.isVisible
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                      }`}
                    >
                      {service.isVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5"
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>

                    <DeleteServiceButton
                      serviceId={
                        service.id
                      }
                      serviceTitle={
                        service.title
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}