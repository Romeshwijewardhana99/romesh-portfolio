"use server";

import { z } from "zod";
import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { slugify } from "@/lib/slugify";
import { deleteProjectUploadDirectory } from "@/lib/uploads";

const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      3,
      "Project title is required."
    )
    .max(150),

  slug: z
    .string()
    .trim()
    .max(180)
    .optional(),

  shortDescription: z
    .string()
    .trim()
    .min(
      10,
      "Short description is required."
    )
    .max(500),

  description: z
    .string()
    .trim()
    .min(
      10,
      "Project description is required."
    ),

  problem: z
    .string()
    .trim()
    .optional(),

  solution: z
    .string()
    .trim()
    .optional(),

  challenges: z
    .string()
    .trim()
    .optional(),

  outcome: z
    .string()
    .trim()
    .optional(),

  githubUrl: z
    .string()
    .trim()
    .optional(),

  liveUrl: z
    .string()
    .trim()
    .optional(),

  clientName: z
    .string()
    .trim()
    .optional(),

  projectType: z
    .string()
    .trim()
    .optional(),

  status: z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ]),

  featured: z.boolean(),

  sortOrder: z
    .number()
    .int()
    .min(0),
  technologyIds: z.array(z.number().int().positive()),
});

function getProjectData(
  formData
) {
  return {
    technologyIds: [...new Set(formData.getAll("technologyIds").map(Number))],
    title:
      formData.get("title") ?? "",

    slug:
      formData.get("slug") ?? "",

    shortDescription:
      formData.get(
        "shortDescription"
      ) ?? "",

    description:
      formData.get(
        "description"
      ) ?? "",

    problem:
      formData.get("problem") ??
      "",

    solution:
      formData.get("solution") ??
      "",

    challenges:
      formData.get(
        "challenges"
      ) ?? "",

    outcome:
      formData.get("outcome") ??
      "",

githubUrl:
      formData.get(
        "githubUrl"
      ) ?? "",

    liveUrl:
      formData.get("liveUrl") ??
      "",

    clientName:
      formData.get(
        "clientName"
      ) ?? "",

    projectType:
      formData.get(
        "projectType"
      ) ?? "",

    status:
      formData.get("status") ??
      "DRAFT",

    featured:
      formData.get("featured") ===
      "on",

    sortOrder: Number(
      formData.get(
        "sortOrder"
      ) ?? 0
    ),
  };
}

export async function createProject(
  previousState,
  formData
) {
  await requireAdmin();

  const parsed =
    projectSchema.safeParse(
      getProjectData(formData)
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

  const projectSlug =
    slugify(
      data.slug ||
        data.title
    );

  if (!projectSlug) {
    return {
      success: false,
      message:
        "Unable to generate a valid project slug.",
      errors: {
        slug: [
          "Enter a valid slug.",
        ],
      },
    };
  }

  const existing =
    await prisma.project.findUnique({
      where: {
        slug: projectSlug,
      },
    });

  if (existing) {
    return {
      success: false,
      message:
        "A project with this slug already exists.",
      errors: {
        slug: [
          "This slug is already in use.",
        ],
      },
    };
  }

  const { technologyIds, ...projectData } = data;

  const project = await prisma.project.create({
    data: {
      ...projectData,

      slug: projectSlug,

      publishedAt:
        projectData.status ===
        "PUBLISHED"
          ? new Date()
          : null,
      technologies: {
        create: technologyIds.map((technologyId) => ({ technologyId })),
      },
    },
  });

  revalidatePath(
    "/admin/projects"
  );

  revalidatePath("/");
  revalidatePath("/projects");

  redirect(`/admin/projects/${project.id}/edit`);
}

export async function updateProject(
  projectId,
  previousState,
  formData
) {
  await requireAdmin();

  const id = Number(projectId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
      message:
        "Invalid project.",
      errors: {},
    };
  }

  const parsed =
    projectSchema.safeParse(
      getProjectData(formData)
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

  const existingProject =
    await prisma.project.findUnique({
      where: {
        id,
      },
    });

  if (!existingProject) {
    return {
      success: false,
      message:
        "Project was not found.",
      errors: {},
    };
  }

  const data = parsed.data;

  const projectSlug =
    slugify(
      data.slug ||
        data.title
    );

  const duplicate =
    await prisma.project.findFirst({
      where: {
        slug: projectSlug,

        NOT: {
          id,
        },
      },
    });

  if (duplicate) {
    return {
      success: false,
      message:
        "A project with this slug already exists.",
      errors: {
        slug: [
          "This slug is already in use.",
        ],
      },
    };
  }

  let publishedAt =
    existingProject.publishedAt;

  if (
    data.status ===
      "PUBLISHED" &&
    !publishedAt
  ) {
    publishedAt = new Date();
  }

  const { technologyIds, ...projectData } = data;


  await prisma.project.update({
    where: {
      id,
    },

    data: {
      ...projectData,
      slug: projectSlug,
      publishedAt,
      technologies: {
        deleteMany: {},
        create: technologyIds.map((technologyId) => ({ technologyId })),
      },
    },
  });

  

  revalidatePath(
    "/admin/projects"
  );

  revalidatePath(
    `/admin/projects/${id}/edit`
  );

  revalidatePath("/");
  revalidatePath("/projects");

  revalidatePath(
    `/projects/${projectSlug}`
  );

  redirect("/admin/projects");
}

export async function deleteProject(
  projectId
) {
  await requireAdmin();

  const id = Number(projectId);

  if (!Number.isInteger(id)) {
    return {
      success: false,
    };
  }

  const project =
    await prisma.project.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        slug: true,
        coverImage: true,
        images: { select: { imageUrl: true } },
      },
    });

  if (!project) {
    return {
      success: false,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM projects WHERE id = ${id} FOR UPDATE`;
    await tx.project.delete({ where: { id } });
  });

  try {
    await deleteProjectUploadDirectory(id);
  } catch (error) {
    console.error("Project image cleanup failed:", error.code || error.name);
  }

  revalidatePath(
    "/admin/projects"
  );

  revalidatePath("/");
  revalidatePath("/projects");

  revalidatePath(
    `/projects/${project.slug}`
  );

  return {
    success: true,
  };
}
