"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

const testimonialSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Client name is required.")
    .max(120),

  clientRole: z
    .string()
    .trim()
    .max(120)
    .optional(),

  company: z
    .string()
    .trim()
    .max(120)
    .optional(),

  avatarUrl: z
    .string()
    .trim()
    .optional(),

  quote: z
    .string()
    .trim()
    .min(10, "Testimonial is required.")
    .max(2000),

  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .nullable(),

  projectId: z
    .number()
    .int()
    .positive()
    .nullable(),

  sortOrder: z
    .number()
    .int()
    .min(0),

  isVisible: z.boolean(),
});

function getTestimonialData(formData) {
  const ratingValue =
    formData.get("rating");

  const projectValue =
    formData.get("projectId");

  return {
    clientName:
      formData.get("clientName") ?? "",

    clientRole:
      formData.get("clientRole") ?? "",

    company:
      formData.get("company") ?? "",

    avatarUrl:
      formData.get("avatarUrl") ?? "",

    quote:
      formData.get("quote") ?? "",

    rating:
      ratingValue
        ? Number(ratingValue)
        : null,

    projectId:
      projectValue
        ? Number(projectValue)
        : null,

    sortOrder: Number(
      formData.get("sortOrder") ?? 0
    ),

    isVisible:
      formData.get("isVisible") === "on",
  };
}

export async function createTestimonial(
  previousState,
  formData
) {
  await requireAdmin();

  const parsed =
    testimonialSchema.safeParse(
      getTestimonialData(formData)
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please check the form fields.",
      errors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.projectId) {
    const project =
      await prisma.project.findUnique({
        where: {
          id: data.projectId,
        },

        select: {
          id: true,
        },
      });

    if (!project) {
      return {
        success: false,
        message:
          "Selected project does not exist.",
        errors: {},
      };
    }
  }

  await prisma.testimonial.create({
    data,
  });

  revalidatePath(
    "/admin/testimonials"
  );

  revalidatePath("/");

  redirect(
    "/admin/testimonials"
  );
}

export async function updateTestimonial(
  testimonialId,
  previousState,
  formData
) {
  await requireAdmin();

  const id =
    Number(testimonialId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
      message:
        "Invalid testimonial.",
      errors: {},
    };
  }

  const parsed =
    testimonialSchema.safeParse(
      getTestimonialData(formData)
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please check the form fields.",
      errors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const existing =
    await prisma.testimonial.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    return {
      success: false,
      message:
        "Testimonial not found.",
      errors: {},
    };
  }

  const data = parsed.data;

  if (data.projectId) {
    const project =
      await prisma.project.findUnique({
        where: {
          id: data.projectId,
        },

        select: {
          id: true,
        },
      });

    if (!project) {
      return {
        success: false,
        message:
          "Selected project does not exist.",
        errors: {},
      };
    }
  }

  await prisma.testimonial.update({
    where: {
      id,
    },

    data,
  });

  revalidatePath(
    "/admin/testimonials"
  );

  revalidatePath("/");

  redirect(
    "/admin/testimonials"
  );
}

export async function deleteTestimonial(
  testimonialId
) {
  await requireAdmin();

  const id =
    Number(testimonialId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
    };
  }

  const testimonial =
    await prisma.testimonial.findUnique({
      where: {
        id,
      },
    });

  if (!testimonial) {
    return {
      success: false,
    };
  }

  await prisma.testimonial.delete({
    where: {
      id,
    },
  });

  revalidatePath(
    "/admin/testimonials"
  );

  revalidatePath("/");

  return {
    success: true,
  };
}