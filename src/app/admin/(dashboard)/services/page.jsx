import Link from "next/link";
import { Plus, Pencil, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });

  return (
    <section>
      <AdminPageHeading eyebrow="Manage content / 02" title="Services"
        description="Define the practical business solutions visitors can hire you to build."
        action={<Link href="/admin/services/create" className="admin-btn-primary"><Plus size={17} /> New Service</Link>}
      />
      {services.length === 0 ? (
        <div className="admin-panel px-6 py-20 text-center">
          <Wrench size={30} className="mx-auto text-[#448663]" />
          <h2 className="mt-5 text-xl font-bold text-[#1B432F]">No services yet.</h2>
          <p className="mt-2 text-sm text-[#6F8172]">Add the services you offer to potential clients.</p>
          <Link href="/admin/services/create" className="admin-btn-primary mt-6"><Plus size={16} /> Add a Service</Link>
        </div>
      ) : (
        <div className="admin-panel overflow-hidden">
          <div className="admin-list-head hidden grid-cols-[minmax(0,1fr)_80px_100px_170px] gap-5 px-6 py-4 lg:grid">
            <span>Service</span><span>Order</span><span>Visibility</span><span className="text-right">Actions</span>
          </div>
          {services.map((service) => (
            <div key={service.id} className="admin-list-row grid gap-5 lg:grid-cols-[minmax(0,1fr)_80px_100px_170px] lg:items-center">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[#204331]">{service.title}</h2>
                <p className="mt-1 truncate text-xs text-[#879689]">/{service.slug}</p>
                <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-6 text-[#6F8173]">{service.shortDescription}</p>
              </div>
              <span className="text-xs font-medium text-[#708574]">{service.sortOrder}</span>
              <div><span className={`admin-pill ${service.isVisible ? "admin-pill--green" : "admin-pill--gray"}`}>{service.isVisible ? "Visible" : "Hidden"}</span></div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Link href={`/admin/services/${service.id}/edit`} className="admin-btn-secondary"><Pencil size={15} /> Edit</Link>
                <DeleteServiceButton serviceId={service.id} serviceTitle={service.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
