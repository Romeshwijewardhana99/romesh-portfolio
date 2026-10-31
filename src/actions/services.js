"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { slugify } from "@/lib/slugify";

const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Service title is required.")
    .max(120),

  slug: z
    .string()
    .trim()
    .max(150)
    .optional(),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description is required.")
    .max(500),

  description: z
    .string()
    .trim()
    .optional(),

  icon: z
    .string()
    .trim()
    .max(255)
    .optional(),

  sortOrder: z
    .number()
    .int()
    .min(0),

  isVisible: z.boolean(),
});

function getServiceData(formData) {
  return {
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    shortDescription:
      formData.get("shortDescription") ?? "",
    description:
      formData.get("description") ?? "",
    icon: formData.get("icon") ?? "",
    sortOrder: Number(
      formData.get("sortOrder") ?? 0
    ),
    isVisible:
      formData.get("isVisible") === "on",
  };
}

export async function createService(
  previousState,
  formData
) {
  await requireAdmin();

  const parsed = serviceSchema.safeParse(
    getServiceData(formData)
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form fields.",
      errors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const serviceSlug = slugify(
    data.slug || data.title
  );

  const existing =
    await prisma.service.findUnique({
      where: {
        slug: serviceSlug,
      },
    });

  if (existing) {
    return {
      success: false,
      message:
        "A service with this slug already exists.",
      errors: {
        slug: [
          "This slug is already in use.",
        ],
      },
    };
  }

  await prisma.service.create({
    data: {
      ...data,
      slug: serviceSlug,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/");

  redirect("/admin/services");
}

export async function updateService(
  serviceId,
  previousState,
  formData
) {
  await requireAdmin();

  const id = Number(serviceId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
      message: "Invalid service.",
      errors: {},
    };
  }

  const parsed = serviceSchema.safeParse(
    getServiceData(formData)
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form fields.",
      errors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const serviceSlug = slugify(
    data.slug || data.title
  );

  const duplicate =
    await prisma.service.findFirst({
      where: {
        slug: serviceSlug,
        NOT: {
          id,
        },
      },
    });

  if (duplicate) {
    return {
      success: false,
      message:
        "Another service already uses this slug.",
      errors: {
        slug: [
          "This slug is already in use.",
        ],
      },
    };
  }

  await prisma.service.update({
    where: {
      id,
    },
    data: {
      ...data,
      slug: serviceSlug,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/");

  redirect("/admin/services");
}

export async function deleteService(
  serviceId
) {
  await requireAdmin();

  const id = Number(serviceId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
    };
  }

  const service =
    await prisma.service.findUnique({
      where: {
        id,
      },
    });

  if (!service) {
    return {
      success: false,
    };
  }

  await prisma.service.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/");

  return {
    success: true,
  };
}