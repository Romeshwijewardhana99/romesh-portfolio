import Link from "next/link";
import { ArrowUpRight, Pencil, Plus, Star, FolderKanban } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

const statusStyle = { PUBLISHED: "admin-pill--green", DRAFT: "admin-pill--amber", ARCHIVED: "admin-pill--gray" };

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section>
      <AdminPageHeading eyebrow="Manage content / 01" title="Projects"
        description="Organize case studies, feature your best work and control what appears on your portfolio."
        action={<Link href="/admin/projects/create" className="admin-btn-primary"><Plus size={17} /> New Project</Link>}
      />
      <div className="mb-5 flex flex-wrap gap-2 text-xs">
        <span className="admin-pill admin-pill--gray">{projects.length} total</span>
        <span className="admin-pill admin-pill--green">{projects.filter((p) => p.status === "PUBLISHED").length} published</span>
        <span className="admin-pill admin-pill--amber">{projects.filter((p) => p.status === "DRAFT").length} draft</span>
      </div>
      {projects.length === 0 ? (
        <div className="admin-panel px-6 py-20 text-center">
          <FolderKanban size={30} className="mx-auto text-[#448663]" />
          <h2 className="mt-5 text-xl font-bold text-[#1B432F]">Your project gallery starts here.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6F8172]">Create a project to start showing clients and hiring teams what you can build.</p>
          <Link href="/admin/projects/create" className="admin-btn-primary mt-6"><Plus size={16} /> Create Project</Link>
        </div>
      ) : (
        <div className="admin-panel overflow-hidden">
          <div className="admin-list-head hidden grid-cols-[minmax(0,1fr)_130px_90px_200px] gap-5 px-6 py-4 lg:grid">
            <span>Project</span><span>Status</span><span>Order</span><span className="text-right">Actions</span>
          </div>
          {projects.map((project) => (
            <div key={project.id} className="admin-list-row grid gap-5 lg:grid-cols-[minmax(0,1fr)_130px_90px_200px] lg:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-bold text-[#204331]">{project.title}</h2>
                  {project.featured && <Star size={15} fill="#D9A94B" className="shrink-0 text-[#C99731]" aria-label="Featured" />}
                </div>
                <p className="mt-1 truncate text-xs text-[#859588]">/{project.slug}</p>
              </div>
              <div><span className={`admin-pill ${statusStyle[project.status] || "admin-pill--gray"}`}>{project.status}</span></div>
              <span className="text-xs font-medium text-[#708574]">{project.sortOrder}</span>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Link href={`/admin/projects/${project.id}/edit`} className="admin-btn-secondary"><Pencil size={15} /> Edit</Link>
                <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/projects" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#347453]">View public project gallery <ArrowUpRight size={14} /></Link>
    </section>
  );
}
