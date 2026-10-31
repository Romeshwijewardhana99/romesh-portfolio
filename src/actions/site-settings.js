"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { getCloudinary } from "@/lib/cloudinary";

const optionalUrl = z.union([
  z.literal(""),
  z.string().url("Enter a valid URL."),
]);

const settingsSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(2, "Site name is required.")
    .max(120),

  heroBadge: z
    .string()
    .trim()
    .max(120)
    .optional(),

  heroTitle: z
    .string()
    .trim()
    .max(250)
    .optional(),

  heroSubtitle: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  email: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .email("Enter a valid email."),
  ]),

  phone: z
    .string()
    .trim()
    .max(40)
    .optional(),

  whatsapp: z
    .string()
    .trim()
    .max(40)
    .optional(),

  location: z
    .string()
    .trim()
    .max(150)
    .optional(),

  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,

  profileImage: z
    .string()
    .trim()
    .optional(),

  profileImagePublicId: z
    .string()
    .trim()
    .optional(),

  resumeUrl: optionalUrl,

  availableForWork: z.boolean(),

  seoTitle: z
    .string()
    .trim()
    .max(70)
    .optional(),

  seoDescription: z
    .string()
    .trim()
    .max(170)
    .optional(),
});

function getSettingsData(formData) {
  return {
    siteName:
      formData.get("siteName") ?? "",

    heroBadge:
      formData.get("heroBadge") ?? "",

    heroTitle:
      formData.get("heroTitle") ?? "",

    heroSubtitle:
      formData.get("heroSubtitle") ?? "",

    email:
      formData.get("email") ?? "",

    phone:
      formData.get("phone") ?? "",

    whatsapp:
      formData.get("whatsapp") ?? "",

    location:
      formData.get("location") ?? "",

    githubUrl:
      formData.get("githubUrl") ?? "",

    linkedinUrl:
      formData.get("linkedinUrl") ?? "",

    facebookUrl:
      formData.get("facebookUrl") ?? "",

    instagramUrl:
      formData.get("instagramUrl") ?? "",

    profileImage:
      formData.get("profileImage") ?? "",

    profileImagePublicId:
      formData.get(
        "profileImagePublicId"
      ) ?? "",

    resumeUrl:
      formData.get("resumeUrl") ?? "",

    availableForWork:
      formData.get(
        "availableForWork"
      ) === "on",

    seoTitle:
      formData.get("seoTitle") ?? "",

    seoDescription:
      formData.get(
        "seoDescription"
      ) ?? "",
  };
}

export async function updateSiteSettings(
  previousState,
  formData
) {
  await requireAdmin();

  const parsed =
    settingsSchema.safeParse(
      getSettingsData(formData)
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

  const data = parsed.data;

  const existing =
    await prisma.siteSetting.findUnique({
      where: {
        id: 1,
      },
    });

  try {
    await prisma.siteSetting.upsert({
      where: {
        id: 1,
      },

      update: data,

      create: {
        id: 1,
        ...data,
      },
    });

    if (
      existing?.profileImagePublicId &&
      existing.profileImagePublicId !==
        data.profileImagePublicId
    ) {
      try {
        await getCloudinary().uploader.destroy(
          existing.profileImagePublicId
        );
      } catch (error) {
        console.error(
          "Old profile image cleanup failed:",
          error
        );
      }
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath(
      "/admin/settings"
    );

    return {
      success: true,
      message:
        "Site settings updated successfully.",
      errors: {},
    };
  } catch (error) {
    console.error(
      "Site settings update failed:",
      error
    );

    return {
      success: false,
      message:
        "Unable to update site settings.",
      errors: {},
    };
  }
}