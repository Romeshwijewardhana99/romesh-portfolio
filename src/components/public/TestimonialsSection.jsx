import { Quote, Star } from "lucide-react";

export default function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <section className="bg-[#F7F7F2] py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-[#378661]">06 / Kind words</p>
        <h2 className="mt-5 max-w-2xl text-[clamp(2.4rem,4.4vw,4.1rem)] font-semibold leading-[1.1] tracking-[-.055em] text-[#142E23]">Good work starts with trust.</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-[24px] border border-[#DCE6DA] bg-white p-7 sm:p-8">
              <div className="flex items-center justify-between"><Quote size={23} className="text-[#57A578]"/>{t.rating ? <div className="flex gap-0.5 text-[#35835B]">{Array.from({length: Math.min(5, Math.max(0, t.rating))}).map((_, i) => <Star size={13} fill="currentColor" key={i}/>)}</div> : null}</div>
              <blockquote className="mt-8 flex-1 text-[15px] leading-8 text-[#425B4B]">“{t.quote}”</blockquote>
              <figcaption className="mt-9 border-t border-[#EBF0E9] pt-6"><strong className="block text-sm font-semibold text-[#173A2A]">{t.clientName}</strong><span className="mt-1 block text-xs text-[#829184]">{[t.clientRole, t.company].filter(Boolean).join(" · ")}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
