import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [adminCount, projectCount] = await Promise.all([
      prisma.adminUser.count(),
      prisma.project.count(),
    ]);

    return Response.json({
      ok: true,
      database: "connected",
      counts: {
        admins: adminCount,
        projects: projectCount,
      },
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return Response.json(
      {
        ok: false,
        database: "disconnected",
      },
      {
        status: 500,
      }
    );
  }
}