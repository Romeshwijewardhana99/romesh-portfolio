import Link from "next/link";
import { ArrowUpRight, ChevronRight, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import InquiryStatusSelect from "@/components/admin/InquiryStatusSelect";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

const statusStyle = { NEW: "admin-pill--blue", READ: "admin-pill--amber", REPLIED: "admin-pill--green", CLOSED: "admin-pill--gray" };

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = inquiries.filter((item) => item.status === "NEW").length;

  return (
    <section>
      <AdminPageHeading eyebrow="Client conversations / 05" title="Inquiries"
        description="Review incoming project requests and keep track of every conversation."
        action={newCount > 0 ? <span className="admin-pill admin-pill--blue">{newCount} new inquiries</span> : null}
      />
      {inquiries.length === 0 ? (
        <div className="admin-panel px-6 py-20 text-center">
          <Inbox size={30} className="mx-auto text-[#448663]" />
          <h2 className="mt-5 text-xl font-bold text-[#1B432F]">No inquiries yet.</h2>
          <p className="mt-2 text-sm text-[#6F8172]">Incoming project requests will appear here.</p>
          <Link href="/contact" target="_blank" rel="noopener noreferrer" className="admin-btn-secondary mt-6">View contact page <ArrowUpRight size={15} /></Link>
        </div>
      ) : (
        <div className="admin-panel overflow-hidden">
          <div className="admin-list-head hidden grid-cols-[minmax(0,1fr)_160px_90px_150px_40px] gap-5 px-6 py-4 lg:grid">
            <span>Client</span><span>Service</span><span>Status</span><span>Manage</span><span />
          </div>
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className={`admin-list-row grid gap-5 lg:grid-cols-[minmax(0,1fr)_160px_90px_150px_40px] lg:items-center ${inquiry.status === "NEW" ? "bg-[#F5FBF5]" : ""}`}>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[#1C412E]">{inquiry.name}</h2>
                <p className="mt-1 truncate text-xs text-[#718678]">{inquiry.email}{inquiry.company ? ` · ${inquiry.company}` : ""}</p>
                <p className="mt-2 line-clamp-1 text-xs leading-6 text-[#7B8E7E]">{inquiry.message}</p>
              </div>
              <span className="truncate text-xs text-[#637965]">{inquiry.service || "Not specified"}</span>
              <div><span className={`admin-pill ${statusStyle[inquiry.status] || "admin-pill--gray"}`}>{inquiry.status}</span></div>
              <div><InquiryStatusSelect inquiryId={inquiry.id} initialStatus={inquiry.status} /></div>
              <Link href={`/admin/inquiries/${inquiry.id}`} aria-label={`Read inquiry from ${inquiry.name}`} className="admin-btn-secondary h-10 w-10 !p-0"><ChevronRight size={17} /></Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
