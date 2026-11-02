import Link from "next/link";
import { Plus, Pencil, Code2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteTechnologyButton from "@/components/admin/DeleteTechnologyButton";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <section>
      <AdminPageHeading eyebrow="Manage content / 03" title="Technologies"
        description="Keep your engineering toolkit and project technology references up to date."
        action={<Link href="/admin/technologies/create" className="admin-btn-primary"><Plus size={17} /> New Technology</Link>}
      />
      {technologies.length === 0 ? (
        <div className="admin-panel px-6 py-20 text-center">
          <Code2 size={30} className="mx-auto text-[#448663]" />
          <h2 className="mt-5 text-xl font-bold text-[#1B432F]">No technologies yet.</h2>
          <p className="mt-2 text-sm text-[#6F8172]">Add the tools you use in your projects.</p>
        </div>
      ) : (
        <div className="admin-panel overflow-hidden">
          <div className="admin-list-head hidden grid-cols-[minmax(0,1fr)_120px_85px_90px_170px] gap-5 px-6 py-4 lg:grid">
            <span>Technology</span><span>Category</span><span>Projects</span><span>Visible</span><span className="text-right">Actions</span>
          </div>
          {technologies.map((technology) => (
            <div key={technology.id} className="admin-list-row grid gap-5 lg:grid-cols-[minmax(0,1fr)_120px_85px_90px_170px] lg:items-center">
              <div className="min-w-0"><h2 className="text-sm font-bold text-[#204331]">{technology.name}</h2><p className="mt-1 text-xs text-[#829386]">/{technology.slug}</p></div>
              <span className="text-xs font-semibold text-[#58765F]">{technology.category}</span>
              <span className="text-xs text-[#6D8170]">{technology._count.projects}</span>
              <div><span className={`admin-pill ${technology.isVisible ? "admin-pill--green" : "admin-pill--gray"}`}>{technology.isVisible ? "Visible" : "Hidden"}</span></div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Link href={`/admin/technologies/${technology.id}/edit`} className="admin-btn-secondary"><Pencil size={15} /> Edit</Link>
                <DeleteTechnologyButton technologyId={technology.id} technologyName={technology.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
