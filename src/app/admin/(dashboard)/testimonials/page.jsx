import Link from "next/link";
import { Plus, Pencil, MessageSquareQuote, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    include: { project: { select: { title: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section>
      <AdminPageHeading eyebrow="Manage content / 04" title="Testimonials"
        description="Show genuine feedback that helps clients and employers trust your work."
        action={<Link href="/admin/testimonials/create" className="admin-btn-primary"><Plus size={17} /> New Testimonial</Link>}
      />
      {testimonials.length === 0 ? (
        <div className="admin-panel px-6 py-20 text-center">
          <MessageSquareQuote size={30} className="mx-auto text-[#448663]" />
          <h2 className="mt-5 text-xl font-bold text-[#1B432F]">No testimonials yet.</h2>
          <p className="mt-2 text-sm text-[#6F8172]">When you have client feedback and permission to share it, add it here.</p>
        </div>
      ) : (
        <div className="grid gap-5 2xl:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.id} className="admin-panel flex flex-col p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#1B412F]">{item.clientName}</h2>
                  <p className="mt-1 text-xs text-[#819286]">{[item.clientRole, item.company].filter(Boolean).join(" · ") || "Client"}</p>
                </div>
                <span className={`admin-pill ${item.isVisible ? "admin-pill--green" : "admin-pill--gray"}`}>{item.isVisible ? "Visible" : "Hidden"}</span>
              </div>
              {item.rating ? <div className="mt-5 flex gap-1 text-[#A57A20]">{Array.from({ length: Math.min(5, Math.max(0, item.rating)) }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}</div> : null}
              <blockquote className="mt-5 flex-1 text-sm leading-7 text-[#47624D]">“{item.quote}”</blockquote>
              {item.project && <p className="mt-4 text-xs text-[#748979]">Related project: {item.project.title}</p>}
              <div className="mt-7 flex flex-wrap justify-end gap-2 border-t border-[#E8EFE6] pt-5">
                <Link href={`/admin/testimonials/${item.id}/edit`} className="admin-btn-secondary"><Pencil size={15} /> Edit</Link>
                <DeleteTestimonialButton testimonialId={item.id} clientName={item.clientName} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
