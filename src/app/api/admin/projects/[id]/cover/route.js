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
    saved = await saveImage(await readImageForm(request), { projectId, kind: "cover" });
    const oldUrl = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw`SELECT id FROM projects WHERE id = ${projectId} FOR UPDATE`;
      if (!rows.length) throw new UploadError("Project not found.", 404);
      const current = await tx.project.findUnique({ where: { id: projectId }, select: { coverImage: true } });
      await tx.project.update({ where: { id: projectId }, data: { coverImage: saved.url } });
      return current.coverImage;
    });
    committed = true;
    if (oldUrl !== saved.url) await safelyDeleteUploadedFile(oldUrl);
    revalidateProjectImages(project);
    return Response.json({ ok: true, ...saved });
  } catch (error) {
    if (saved && !committed) await safelyDeleteUploadedFile(saved.url);
    return uploadErrorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireUploadAdmin(request);
    const projectId = parseProjectId((await params).id);
    const project = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw`SELECT id FROM projects WHERE id = ${projectId} FOR UPDATE`;
      if (!rows.length) throw new UploadError("Project not found.", 404);
      const current = await tx.project.findUnique({ where: { id: projectId } });
      await tx.project.update({ where: { id: projectId }, data: { coverImage: null } });
      return current;
    });
    await safelyDeleteUploadedFile(project.coverImage);
    revalidateProjectImages(project);
    return Response.json({ ok: true });
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
