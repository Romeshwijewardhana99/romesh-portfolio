import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

const projectFields = {
  id: true, slug: true, title: true, shortDescription: true, coverImage: true, projectType: true,
  technologies: {
    where: { technology: { isVisible: true } },
    select: { technology: { select: { id: true, name: true } } },
  },
};
const projectOrder = [{ sortOrder: "asc" }, { publishedAt: "desc" }, { id: "desc" }];

export const getHomepageData = cache(async () => {
  const [settings, services, featured, technologies, testimonials] = await Promise.all([
    getSiteSettings(),
    prisma.service.findMany({
      where: { isVisible: true }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }], take: 6,
      select: { id: true, title: true, shortDescription: true, icon: true },
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED", featured: true }, orderBy: projectOrder, take: 4, select: projectFields,
    }),
    prisma.technology.findMany({
      where: { isVisible: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, category: true },
    }),
    prisma.testimonial.findMany({
      where: { isVisible: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 4,
      select: { id: true, clientName: true, clientRole: true, company: true, quote: true, rating: true },
    }),
  ]);
  const projects = featured.length ? featured : await prisma.project.findMany({
    where: { status: "PUBLISHED" }, orderBy: projectOrder, take: 4, select: projectFields,
  });
  return { settings, services, projects, technologies, testimonials };
});
