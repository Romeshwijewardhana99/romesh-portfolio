import { prisma } from "@/lib/prisma";
import {
  getSiteSettings,
} from "@/lib/site-settings";

import Hero from "@/components/public/Hero";
import ServicesSection from "@/components/public/ServicesSection";
import FeaturedProjects from "@/components/public/FeaturedProjects";
import TechStackSection from "@/components/public/TechStackSection";
import ProcessSection from "@/components/public/ProcessSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CTASection from "@/components/public/CTASection";

export async function generateMetadata() {
  const settings =
    await getSiteSettings();

  return {
    title:
      settings?.seoTitle ||
      "Romesh Wijewardhana | Full-Stack Developer",

    description:
      settings?.seoDescription ||
      "Full-stack developer building modern web applications and business systems.",
  };
}

export default async function HomePage() {
  const [
    settings,
    services,
    projects,
    technologies,
    testimonials,
  ] = await Promise.all([
    getSiteSettings(),

    prisma.service.findMany({
      where: {
        isVisible: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          title: "asc",
        },
      ],

      take: 6,
    }),

    prisma.project.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
      },

      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          publishedAt:
            "desc",
        },
      ],

      take: 4,
    }),

    prisma.technology.findMany({
      where: {
        isVisible: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),

    prisma.testimonial.findMany({
      where: {
        isVisible: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt:
            "desc",
        },
      ],

      take: 6,
    }),
  ]);

  return (
    <main>
      <Hero
        settings={settings}
      />

      <ServicesSection
        services={services}
      />

      <FeaturedProjects
        projects={projects}
      />

      <TechStackSection
        technologies={
          technologies
        }
      />

      <ProcessSection />

      <TestimonialsSection
        testimonials={
          testimonials
        }
      />

      <CTASection
        availableForWork={
          settings?.availableForWork ??
          true
        }
      />
    </main>
  );
}