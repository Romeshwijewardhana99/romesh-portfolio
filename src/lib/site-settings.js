import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings =
    await prisma.siteSetting.findUnique({
      where: {
        id: 1,
      },
    });

  return settings;
}
