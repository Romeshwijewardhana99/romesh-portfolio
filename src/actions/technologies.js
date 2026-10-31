"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { slugify } from "@/lib/slugify";

const technologySchema = z.object({
  name: z.string().trim().min(2, "Technology name is required.").max(80),
  slug: z.string().trim().max(100).optional(),
  icon: z.string().trim().max(255).optional(),
  category: z.enum([
    "FRONTEND",
    "BACKEND",
    "DATABASE",
    "MOBILE",
    "DEVOPS",
    "TOOL",
    "OTHER",
  ]),
  sortOrder: z.number().int().min(0),
  isVisible: z.boolean(),
});

function getTechnologyData(formData) {
  return {
    name: formData.get("name") ?? "",
    slug: formData.get("slug") ?? "",
    icon: formData.get("icon") ?? "",
    category: formData.get("category") ?? "OTHER",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isVisible: formData.get("isVisible") === "on",
  };
}

export async function createTechnology(previousState, formData) {
  await requireAdmin();

  const parsed = technologySchema.safeParse(getTechnologyData(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const technologySlug = slugify(data.slug || data.name);

  if (!technologySlug) {
    return {
      success: false,
      message: "Invalid slug.",
      errors: { slug: ["Enter a valid slug."] },
    };
  }

  const duplicate = await prisma.technology.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: technologySlug }],
    },
  });

  if (duplicate) {
    return {
      success: false,
      message: "Technology already exists.",
      errors: {},
    };
  }

  await prisma.technology.create({
    data: { ...data, slug: technologySlug },
  });

  revalidatePath("/admin/technologies");
  redirect("/admin/technologies");
}

export async function updateTechnology(technologyId, previousState, formData) {
  await requireAdmin();

  const id = Number(technologyId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
      message: "Invalid technology.",
      errors: {},
    };
  }

  const parsed = technologySchema.safeParse(getTechnologyData(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const technologySlug = slugify(data.slug || data.name);

  const duplicate = await prisma.technology.findFirst({
    where: {
      NOT: { id },
      OR: [{ name: data.name }, { slug: technologySlug }],
    },
  });

  if (duplicate) {
    return {
      success: false,
      message: "Another technology already uses this name or slug.",
      errors: {},
    };
  }

  await prisma.technology.update({
    where: { id },
    data: { ...data, slug: technologySlug },
  });

  revalidatePath("/admin/technologies");
  revalidatePath("/admin/projects");
  redirect("/admin/technologies");
}

export async function deleteTechnology(technologyId) {
  await requireAdmin();

  const id = Number(technologyId);

  if (!Number.isInteger(id)) {
    return { success: false };
  }

  const technology = await prisma.technology.findUnique({
    where: { id },
  });

  if (!technology) {
    return { success: false };
  }

  await prisma.technology.delete({ where: { id } });

  revalidatePath("/admin/technologies");
  revalidatePath("/admin/projects");

  return { success: true };
}
