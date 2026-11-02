import { prisma } from "@/lib/prisma";
import { parseProjectId, safelyDeleteUploadedFile, UploadError } from "@/lib/uploads";
import { requireUploadAdmin, uploadErrorResponse, revalidateProjectImages } from "@/lib/upload-api";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
  try {
    await requireUploadAdmin(request);
    const { id, imageId } = await params;
    const projectId = parseProjectId(id);
    const galleryId = parseProjectId(imageId);
    const result = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw`SELECT id FROM projects WHERE id = ${projectId} FOR UPDATE`;
      if (!rows.length) throw new UploadError("Project not found.", 404);
      const image = await tx.projectImage.findFirst({ where: { id: galleryId, projectId } });
      if (!image) throw new UploadError("Image not found.", 404);
      const project = await tx.project.findUnique({ where: { id: projectId } });
      await tx.projectImage.delete({ where: { id: galleryId } });
      return { image, project };
    });
    await safelyDeleteUploadedFile(result.image.imageUrl);
    revalidateProjectImages(result.project);
    return Response.json({ ok: true });
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
