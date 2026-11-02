import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { withSiteSettingsDefaults } from "@/lib/validations/site-settings";

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSetting.findFirst({ orderBy: { id: "asc" } });
  return withSiteSettingsDefaults(settings);
});

// Serialize writes to the effective first row, including the initial creation.
export async function saveSiteSettings(data) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM site_settings ORDER BY id LIMIT 1 FOR UPDATE`;
        const previous = await tx.siteSetting.findFirst({ orderBy: { id: "asc" } });
        const current = previous
          ? await tx.siteSetting.update({ where: { id: previous.id }, data })
          : await tx.siteSetting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
        return { previous, current };
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (error.code !== "P2034" || attempt === 2) throw error;
    }
  }
}
