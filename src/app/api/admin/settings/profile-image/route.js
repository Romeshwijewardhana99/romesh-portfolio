import { revalidatePath } from "next/cache";
import { readImageForm, saveImage, safelyDeleteUploadedFile } from "@/lib/uploads";
import { requireUploadAdmin, uploadErrorResponse } from "@/lib/upload-api";
import { saveSiteSettings } from "@/lib/site-settings";

export const runtime = "nodejs";

function refreshSettings() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function POST(request) {
  let image;
  let committed = false;
  try {
    await requireUploadAdmin(request);
    image = await saveImage(await readImageForm(request), { kind: "profile" });
    const { previous } = await saveSiteSettings({ profileImage: image.url });
    committed = true;
    if (previous?.profileImage !== image.url) await safelyDeleteUploadedFile(previous?.profileImage);
    refreshSettings();
    return Response.json({ ok: true, image });
  } catch (error) {
    if (image && !committed) await safelyDeleteUploadedFile(image.url);
    return uploadErrorResponse(error);
  }
}

export async function DELETE(request) {
  try {
    await requireUploadAdmin(request);
    const { previous } = await saveSiteSettings({ profileImage: null });
    await safelyDeleteUploadedFile(previous?.profileImage);
    refreshSettings();
    return Response.json({ ok: true });
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
