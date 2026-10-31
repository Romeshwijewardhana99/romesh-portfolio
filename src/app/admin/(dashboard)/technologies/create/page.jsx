import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import TechnologyForm from "@/components/admin/TechnologyForm";

export default function CreateTechnologyPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <Link
        href="/admin/technologies"
        className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Technologies
      </Link>

      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Portfolio Content
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Add Technology
        </h1>
      </div>

      <TechnologyForm />
    </section>
  );
}
