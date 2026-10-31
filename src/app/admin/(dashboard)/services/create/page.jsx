import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ServiceForm from "@/components/admin/ServiceForm";

export default function CreateServicePage() {
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
          Portfolio Content
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Create Service
        </h1>
      </div>

      <ServiceForm />
    </section>
  );
}