import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

import Hero from "@/components/public/Hero";
import FeaturedProjects from "@/components/public/FeaturedProjects";
import ServicesSection from "@/components/public/ServicesSection";
import AboutPreview from "@/components/public/AboutPreview";
import ProcessSection from "@/components/public/ProcessSection";
import TechStackSection from "@/components/public/TechStackSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CTASection from "@/components/public/CTASection";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings?.seoTitle || "Romesh Wijewardhana | Full-Stack Developer",
    description:
      settings?.seoDescription ||
      "Custom business websites, full-stack web applications and practical software solutions by Romesh Wijewardhana.",
  };
}

export default async function HomePage() {
  const [settings, services, projects, technologies, testimonials] =
    await Promise.all([
      getSiteSettings(),
      prisma.service.findMany({
        where: { isVisible: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        take: 6,
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED", featured: true },
        include: { technologies: { include: { technology: true } } },
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
        take: 4,
      }),
      prisma.technology.findMany({
        where: { isVisible: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.testimonial.findMany({
        where: { isVisible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 3,
      }),
    ]);

  return (
    <main>
      <Hero settings={settings} featuredProject={projects[0] ?? null} />
      <FeaturedProjects projects={projects} />
      <ServicesSection services={services} />
      <AboutPreview settings={settings} />
      <ProcessSection />
      <TechStackSection technologies={technologies} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection availableForWork={settings?.availableForWork ?? true} />
    </main>
  );
}
