"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(190),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  company: z
    .string()
    .trim()
    .max(150)
    .optional(),

  service: z
    .string()
    .trim()
    .max(150)
    .optional(),

  budget: z
    .string()
    .trim()
    .max(100)
    .optional(),

  timeline: z
    .string()
    .trim()
    .max(100)
    .optional(),

  message: z
    .string()
    .trim()
    .min(
      20,
      "Please provide a little more information about your project."
    )
    .max(5000),

  // Honeypot field
  website: z
    .string()
    .max(0)
    .optional(),
});

export async function createInquiry(
  previousState,
  formData
) {
  const rawData = {
    name:
      formData.get("name") ?? "",

    email:
      formData.get("email") ?? "",

    phone:
      formData.get("phone") ?? "",

    company:
      formData.get("company") ?? "",

    service:
      formData.get("service") ?? "",

    budget:
      formData.get("budget") ?? "",

    timeline:
      formData.get("timeline") ?? "",

    message:
      formData.get("message") ?? "",

    website:
      formData.get("website") ?? "",
  };

  const parsed =
    inquirySchema.safeParse(
      rawData
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please check the form fields.",
      errors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const {
    website,
    ...data
  } = parsed.data;

  // Bot filled honeypot
  if (website) {
    return {
      success: true,
      message:
        "Thank you. Your inquiry has been received.",
      errors: {},
    };
  }

  try {
    await prisma.inquiry.create({
      data: {
        name: data.name,
        email:
          data.email.toLowerCase(),
        phone:
          data.phone || null,
        company:
          data.company || null,
        service:
          data.service || null,
        budget:
          data.budget || null,
        timeline:
          data.timeline || null,
        message:
          data.message,
        status: "NEW",
      },
    });

    revalidatePath(
      "/admin/inquiries"
    );

    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Thanks! Your project inquiry has been received. I'll get back to you soon.",
      errors: {},
    };
  } catch (error) {
    console.error(
      "Create inquiry failed:",
      error
    );

    return {
      success: false,
      message:
        "Unable to send your inquiry right now. Please try again.",
      errors: {},
    };
  }
}

export async function updateInquiryStatus(
  inquiryId,
  status
) {
  await requireAdmin();

  const id =
    Number(inquiryId);

  const allowedStatuses = [
    "NEW",
    "READ",
    "REPLIED",
    "CLOSED",
  ];

  if (
    !Number.isInteger(id) ||
    !allowedStatuses.includes(
      status
    )
  ) {
    return {
      success: false,
    };
  }

  const inquiry =
    await prisma.inquiry.findUnique({
      where: {
        id,
      },
    });

  if (!inquiry) {
    return {
      success: false,
    };
  }

  await prisma.inquiry.update({
    where: {
      id,
    },

    data: {
      status,
    },
  });

  revalidatePath(
    "/admin/inquiries"
  );

  revalidatePath(
    `/admin/inquiries/${id}`
  );

  revalidatePath("/admin");

  return {
    success: true,
  };
}

export async function deleteInquiry(
  inquiryId
) {
  await requireAdmin();

  const id =
    Number(inquiryId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
    };
  }

  const inquiry =
    await prisma.inquiry.findUnique({
      where: {
        id,
      },
    });

  if (!inquiry) {
    return {
      success: false,
    };
  }

  await prisma.inquiry.delete({
    where: {
      id,
    },
  });

  revalidatePath(
    "/admin/inquiries"
  );

  revalidatePath("/admin");

  return {
    success: true,
  };
}