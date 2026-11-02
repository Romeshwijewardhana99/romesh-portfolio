"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { safelyDeleteUploadedFile } from "@/lib/uploads";
import { saveSiteSettings } from "@/lib/site-settings";
import { siteSettingsSchema, getSettingsFormData } from "@/lib/validations/site-settings";

export async function updateSiteSettings(previousState, formData) {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(getSettingsFormData(formData));
  if (!parsed.success) {
    return { success: false, message: "Please check the form fields.", errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const data = { ...parsed.data };
    if (data.profileImage === "") data.profileImage = null;
    const { previous, current } = await saveSiteSettings(data);
    if (previous?.profileImage && previous.profileImage !== current.profileImage) {
      await safelyDeleteUploadedFile(previous.profileImage);
    }
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, message: "Site settings updated successfully.", errors: {} };
  } catch (error) {
    console.error("Site settings update failed:", error.code || error.name);
    return { success: false, message: "Unable to update site settings.", errors: {} };
  }
}
