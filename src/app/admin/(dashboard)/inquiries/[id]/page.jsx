import Link from "next/link";
import {
  notFound,
} from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import InquiryStatusSelect from "@/components/admin/InquiryStatusSelect";
import DeleteInquiryButton from "@/components/admin/DeleteInquiryButton";

export default async function InquiryDetailPage({
  params,
}) {
  const { id } =
    await params;

  const inquiryId =
    Number(id);

  if (
    !Number.isInteger(
      inquiryId
    )
  ) {
    notFound();
  }

  const inquiry =
    await prisma.inquiry.findUnique({
      where: {
        id: inquiryId,
      },
    });

  if (!inquiry) {
    notFound();
  }

  // First open: NEW -> READ
  if (
    inquiry.status === "NEW"
  ) {
    await prisma.inquiry.update({
      where: {
        id: inquiry.id,
      },

      data: {
        status: "READ",
      },
    });

    inquiry.status = "READ";
  }

  return (
    <section className="mx-auto max-w-5xl">
      <Link
        href="/admin/inquiries"
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft size={16} />

        Back to Inquiries
      </Link>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            Client Inquiry
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {inquiry.name}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Received{" "}
            {inquiry.createdAt.toLocaleString(
              "en-US",
              {
                dateStyle:
                  "medium",
                timeStyle:
                  "short",
              }
            )}
          </p>
        </div>

        <InquiryStatusSelect
          inquiryId={
            inquiry.id
          }
          initialStatus={
            inquiry.status
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <h2 className="text-lg font-medium">
            Project Request
          </h2>

          <div className="mt-6 whitespace-pre-wrap leading-7 text-neutral-300">
            {inquiry.message}
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-600">
                Service
              </p>

              <p className="mt-2 text-sm">
                {inquiry.service ??
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-600">
                Budget
              </p>

              <p className="mt-2 text-sm">
                {inquiry.budget ??
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-600">
                Timeline
              </p>

              <p className="mt-2 text-sm">
                {inquiry.timeline ??
                  "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <h2 className="font-medium">
              Client
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <a
                href={`mailto:${inquiry.email}`}
                className="flex items-center gap-3 text-neutral-300 hover:text-white"
              >
                <Mail
                  size={17}
                  className="text-neutral-500"
                />

                <span className="break-all">
                  {inquiry.email}
                </span>
              </a>

              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-3 text-neutral-300 hover:text-white"
                >
                  <Phone
                    size={17}
                    className="text-neutral-500"
                  />

                  {
                    inquiry.phone
                  }
                </a>
              )}

              {inquiry.company && (
                <div className="flex items-center gap-3 text-neutral-300">
                  <Building2
                    size={17}
                    className="text-neutral-500"
                  />

                  {
                    inquiry.company
                  }
                </div>
              )}

              <div className="flex items-center gap-3 text-neutral-500">
                <Calendar
                  size={17}
                />

                {inquiry.createdAt.toLocaleDateString()}
              </div>
            </div>

            <a
              href={`mailto:${inquiry.email}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
            >
              <Mail size={16} />

              Reply by Email
            </a>
          </div>

          <DeleteInquiryButton
            inquiryId={
              inquiry.id
            }
            clientName={
              inquiry.name
            }
          />
        </aside>
      </div>
    </section>
  );
}