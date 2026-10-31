import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/session";

export async function getCurrentAdmin() {
  const session = await getAdminSession();

  if (!session?.sub) {
    return null;
  }

  const adminId = Number(session.sub);

  if (!Number.isInteger(adminId)) {
    return null;
  }

  const admin = await prisma.adminUser.findFirst({
    where: {
      id: adminId,
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastLoginAt: true,
    },
  });

  return admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}