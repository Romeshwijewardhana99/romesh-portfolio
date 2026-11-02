import Link from "next/link";
import {
  ArrowUpRight, FolderKanban, Inbox, Layers3,
  MessageSquareQuote, Wrench, Code2, Eye, CalendarDays,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    totalProjects, publishedProjects, newInquiries, totalInquiries,
    totalServices, totalTechnologies, totalTestimonials, recentProjects, recentInquiries,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count(),
    prisma.service.count(),
    prisma.technology.count(),
    prisma.testimonial.count(),
    prisma.project.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" }, take: 4,
    }),
    prisma.inquiry.findMany({
      select: { id: true, name: true, service: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" }, take: 4,
    }),
  ]);

  const cards = [
    { label: "Total Projects", value: totalProjects, detail: `${publishedProjects} published`, icon: FolderKanban, href: "/admin/projects" },
    { label: "New Inquiries", value: newInquiries, detail: `${totalInquiries} total inquiries`, icon: Inbox, href: "/admin/inquiries" },
    { label: "Services", value: totalServices, detail: "Service offerings", icon: Wrench, href: "/admin/services" },
    { label: "Technologies", value: totalTechnologies, detail: "Technical toolkit", icon: Code2, href: "/admin/technologies" },
  ];

  const statusColor = {
    PUBLISHED: "admin-pill--green", DRAFT: "admin-pill--amber", ARCHIVED: "admin-pill--gray",
    NEW: "admin-pill--blue", READ: "admin-pill--amber", REPLIED: "admin-pill--green", CLOSED: "admin-pill--gray",
  };

  return (
    <section className="space-y-8 lg:space-y-10">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="admin-eyebrow">Welcome to your workspace</p>
          <h1 className="admin-page-title mt-3">Dashboard overview<span className="text-[#35936B]">.</span></h1>
          <p className="admin-page-description mt-3">Manage your work, content and client conversations in one place.</p>
        </div>
        <Link href="/admin/projects/create" className="admin-btn-primary self-start md:self-auto">
          <Layers3 size={16} /> Add New Project <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, href }) => (
          <Link href={href} key={label} className="group admin-panel p-5 transition hover:-translate-y-0.5 hover:border-[#A9CEB2] hover:shadow-[0_16px_35px_rgba(21,57,39,.08)] sm:p-6">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF4EA] text-[#236748]"><Icon size={21} /></span>
              <ArrowUpRight size={16} className="text-[#8AA18F] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-7 text-[13px] font-semibold text-[#61786A]">{label}</p>
            <p className="mt-2 text-[38px] font-bold leading-none tracking-[-.065em] text-[#153D2A] tabular-nums">{value}</p>
            <p className="mt-3 text-xs text-[#819385]">{detail}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="admin-panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-[#E5EDE4] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#173C2C]">Recent inquiries</h2>
              <p className="mt-1 text-xs text-[#829083]">Latest contact requests</p>
            </div>
            <Link href="/admin/inquiries" className="admin-btn-secondary">View all <ArrowUpRight size={14} /></Link>
          </div>
          {recentInquiries.length ? (
            <div>
              {recentInquiries.map((item) => (
                <Link href={`/admin/inquiries/${item.id}`} key={item.id} className="admin-list-row flex flex-wrap items-center justify-between gap-3 transition hover:bg-[#F7FBF6]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#173A29]">{item.name}</p>
                    <p className="mt-1 truncate text-xs text-[#7C8D80]">{item.service || "General inquiry"} · {item.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <span className={`admin-pill ${statusColor[item.status] || "admin-pill--gray"}`}>{item.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-sm text-[#738576]"><Inbox className="mx-auto mb-3" size={24} />No inquiries yet.</div>
          )}
        </div>

        <div className="admin-panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-[#E5EDE4] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#173C2C]">Recent projects</h2>
              <p className="mt-1 text-xs text-[#829083]">Latest work updates</p>
            </div>
            <Link href="/admin/projects" className="admin-btn-secondary">View all <ArrowUpRight size={14} /></Link>
          </div>
          {recentProjects.length ? (
            <div>
              {recentProjects.map((item) => (
                <Link href={`/admin/projects/${item.id}/edit`} key={item.id} className="admin-list-row flex flex-wrap items-center justify-between gap-3 transition hover:bg-[#F7FBF6]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#173A29]">{item.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#7C8D80]"><CalendarDays size={12} /> Updated {item.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                  <span className={`admin-pill ${statusColor[item.status] || "admin-pill--gray"}`}>{item.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-sm text-[#738576]"><FolderKanban className="mx-auto mb-3" size={24} />No projects yet.</div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <div className="relative overflow-hidden rounded-[24px] bg-[#174734] p-7 text-white sm:p-9">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <p className="text-[11px] font-bold uppercase tracking-[.19em] text-[#AFE1BD]">Your portfolio is your storefront</p>
          <h2 className="relative mt-3 max-w-lg text-2xl font-bold tracking-[-.045em] sm:text-3xl">Keep your work up to date.</h2>
          <p className="relative mt-3 max-w-lg text-sm leading-7 text-[#C9E5D3]">Show potential clients and hiring teams your best work and most relevant skills.</p>
          <Link href="/" target="_blank" rel="noopener noreferrer" className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E2F4E4] px-4 py-3 text-xs font-bold text-[#163E2B]">View live portfolio <Eye size={15} /></Link>
        </div>
        <Link href="/admin/testimonials" className="admin-panel flex flex-col justify-between p-7 transition hover:border-[#ACCFB6]">
          <div className="flex items-center justify-between"><MessageSquareQuote size={24} className="text-[#2B8058]" /><ArrowUpRight size={17} className="text-[#6F9179]" /></div>
          <div className="mt-9"><p className="text-3xl font-bold tracking-[-.04em] text-[#19432F]">{totalTestimonials}</p><p className="mt-2 text-sm font-semibold text-[#2C4E37]">Client Testimonials</p><p className="mt-1 text-xs text-[#809384]">Manage feedback and social proof</p></div>
        </Link>
      </div>
    </section>
  );
}
