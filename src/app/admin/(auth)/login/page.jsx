import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Portfolio CMS
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Sign in to manage projects,
            services and portfolio content.
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </main>
  );
}