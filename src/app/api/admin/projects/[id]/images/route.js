import { prisma } from "@/lib/prisma";
import { parseProjectId, readImageForm, saveImage, safelyDeleteUploadedFile, UploadError } from "@/lib/uploads";
import { requireUploadAdmin, uploadErrorResponse, revalidateProjectImages } from "@/lib/upload-api";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  let saved;
  let committed = false;
  try {
    await requireUploadAdmin(request);
    const projectId = parseProjectId((await params).id);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new UploadError("Project not found.", 404);
    saved = await saveImage(await readImageForm(request), { projectId, kind: "gallery" });
    const image = await prisma.$transaction(async (tx) => {
      // Serialize uploads on the parent so concurrent requests use distinct orders.
      const rows = await tx.$queryRaw`SELECT id FROM projects WHERE id = ${projectId} FOR UPDATE`;
      if (!rows.length) throw new UploadError("Project not found.", 404);
      const last = await tx.projectImage.aggregate({ where: { projectId }, _max: { sortOrder: true } });
      return tx.projectImage.create({
        data: { projectId, imageUrl: saved.url, width: saved.width, height: saved.height,
          sortOrder: (last._max.sortOrder ?? -1) + 1 },
      });
    });
    committed = true;
    revalidateProjectImages(project);
    return Response.json({ ok: true, image });
  } catch (error) {
    if (saved && !committed) await safelyDeleteUploadedFile(saved.url);
    return uploadErrorResponse(error);
  }
}
