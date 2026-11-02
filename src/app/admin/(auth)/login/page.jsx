import { redirect } from "next/navigation";
import { ArrowUpRight, LockKeyhole, ShieldCheck, Layers3 } from "lucide-react";
import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-[#F7F7F2] lg:grid-cols-[.95fr_1.05fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#102D25] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[650px] w-[650px] rounded-full border border-[#7EB994]/20" />
        <div className="pointer-events-none absolute bottom-8 right-8 h-[370px] w-[370px] rounded-full border border-[#7EB994]/20" />
        <Link href="/" className="relative inline-flex items-center gap-3 self-start">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><Layers3 size={22} /></span>
          <span className="text-xl font-bold tracking-[-.06em]">Romesh<span className="text-[#A1E7B8]">.</span></span>
        </Link>
        <div className="relative max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#A2DDB7]">Private workspace</p>
          <h1 className="mt-6 text-[clamp(2.9rem,4vw,4.5rem)] font-semibold leading-[1.07] tracking-[-.06em]">Craft the work. Manage the details.</h1>
          <p className="mt-6 max-w-md text-base leading-8 text-[#BFD8C8]">A quiet, organized space for the projects, services and conversations behind your portfolio.</p>
        </div>
        <div className="relative inline-flex items-center gap-2 text-xs text-[#9FCEAE]"><ShieldCheck size={16} /> Secure portfolio administration</div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-[460px]">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-bold tracking-tight text-[#194632] lg:hidden">Romesh<span className="text-[#35986A]">.</span></Link>
          <div className="mb-9 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#E2F0E3] text-[#2C7450]"><LockKeyhole size={24} /></div>
          <p className="admin-eyebrow">Portfolio CMS / Secure access</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-.06em] text-[#153A29]">Welcome back.</h2>
          <p className="mt-4 text-sm leading-7 text-[#728477]">Sign in with your administrator credentials to manage portfolio content.</p>
          <div className="mt-9 rounded-[24px] border border-[#DCE8DD] bg-white p-6 shadow-[0_16px_60px_rgba(22,61,34,.06)] sm:p-8">
            <AdminLoginForm />
          </div>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#4B7356] hover:text-[#206C46]">Back to portfolio <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </main>
  );
}
