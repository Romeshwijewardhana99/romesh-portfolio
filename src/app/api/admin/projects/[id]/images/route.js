import { prisma } from "@/lib/prisma";
import { getCloudinary } from "@/lib/cloudinary";
import { getCurrentAdmin } from "@/lib/auth/admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function uploadBuffer(buffer, projectId) {
  return new Promise((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream(
      {
        folder: `romesh-portfolio/projects/${projectId}/gallery`,
        resource_type: "image",
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(request, { params }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return Response.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return Response.json(
      { ok: false, message: "Invalid project." },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    return Response.json(
      { ok: false, message: "Project not found." },
      { status: 404 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { ok: false, message: "Image is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
      return Response.json(
        { ok: false, message: "Invalid image file." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadBuffer(buffer, projectId);

    const lastImage = await prisma.projectImage.findFirst({
      where: { projectId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const image = await prisma.projectImage.create({
      data: {
        projectId,
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        width: uploaded.width,
        height: uploaded.height,
        sortOrder: (lastImage?.sortOrder ?? -1) + 1,
      },
    });

    return Response.json({ ok: true, image });
  } catch (error) {
    console.error("Gallery upload failed:", error);

    return Response.json(
      { ok: false, message: "Unable to upload image." },
      { status: 500 }
    );
  }
}
