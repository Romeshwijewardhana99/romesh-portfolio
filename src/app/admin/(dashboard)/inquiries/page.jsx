import Link from "next/link";
import {
  ChevronRight,
  Mail,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import InquiryStatusSelect from "@/components/admin/InquiryStatusSelect";

function statusClass(
  status
) {
  switch (status) {
    case "NEW":
      return "text-sky-400";

    case "READ":
      return "text-amber-400";

    case "REPLIED":
      return "text-emerald-400";

    default:
      return "text-neutral-500";
  }
}

export default async function InquiriesPage() {
  const inquiries =
    await prisma.inquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  const newCount =
    inquiries.filter(
      (item) =>
        item.status === "NEW"
    ).length;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Client Leads
        </p>

        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-3xl font-semibold">
            Inquiries
          </h1>

          {newCount > 0 && (
            <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400">
              {newCount} new
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-neutral-500">
          Review and manage incoming
          project requests.
        </p>
      </div>

      {inquiries.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <Mail
            className="mx-auto text-neutral-600"
            size={28}
          />

          <h2 className="mt-4 font-medium">
            No inquiries yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            New client inquiries will
            appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="divide-y divide-white/10">
            {inquiries.map(
              (inquiry) => (
                <div
                  key={inquiry.id}
                  className={`grid gap-5 px-5 py-5 lg:grid-cols-[1fr_180px_170px_40px] lg:items-center ${
                    inquiry.status ===
                    "NEW"
                      ? "bg-white/[0.035]"
                      : ""
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium text-white">
                        {
                          inquiry.name
                        }
                      </h2>

                      <span
                        className={`text-xs font-medium ${statusClass(
                          inquiry.status
                        )}`}
                      >
                        {
                          inquiry.status
                        }
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-neutral-500">
                      {
                        inquiry.email
                      }

                      {inquiry.company
                        ? ` · ${inquiry.company}`
                        : ""}
                    </p>

                    <p className="mt-3 line-clamp-1 text-sm text-neutral-400">
                      {
                        inquiry.message
                      }
                    </p>
                  </div>

                  <div className="text-sm text-neutral-500">
                    {inquiry.service ??
                      "Not specified"}
                  </div>

                  <InquiryStatusSelect
                    inquiryId={
                      inquiry.id
                    }
                    initialStatus={
                      inquiry.status
                    }
                  />

                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <ChevronRight
                      size={17}
                    />
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}