import "server-only";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { UploadError } from "@/lib/uploads";

export async function requireUploadAdmin(request) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new UploadError("Unauthorized.", 401);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new UploadError("Invalid request origin.", 403);
  }
  return admin;
}

export function uploadErrorResponse(error) {
  if (error instanceof UploadError) {
    return Response.json({ ok: false, message: error.message }, { status: error.status });
  }
  console.error("Image operation failed:", error.code || error.name);
  return Response.json({ ok: false, message: "Unable to process image. Check storage configuration and try again." }, { status: 500 });
}

export function revalidateProjectImages(project) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${project.id}/edit`);
}
