import path from "node:path";
import {
  mkdir,
  unlink,
  rm,
} from "node:fs/promises";

export function getUploadRoot() {
  const uploadDir = process.env.UPLOAD_DIR;

  if (!uploadDir) {
    throw new Error(
      "UPLOAD_DIR environment variable is not defined."
    );
  }

  return path.resolve(uploadDir);
}

export function getProjectUploadDirectory(projectId) {
  return path.join(
    getUploadRoot(),
    "projects",
    String(projectId)
  );
}

export async function ensureProjectUploadDirectory(
  projectId
) {
  const directory =
    getProjectUploadDirectory(projectId);

  await mkdir(directory, {
    recursive: true,
  });

  return directory;
}

export function buildProjectImageUrl(
  projectId,
  filename
) {
  return `/uploads/projects/${projectId}/${filename}`;
}

export function uploadUrlToFilePath(url) {
  if (
    !url ||
    !url.startsWith("/uploads/")
  ) {
    return null;
  }

  const relativePath = url
    .replace(/^\/uploads\//, "")
    .split("/")
    .filter(Boolean);

  const root = getUploadRoot();

  const filePath = path.resolve(
    root,
    ...relativePath
  );

  const allowedRoot =
    root.endsWith(path.sep)
      ? root
      : root + path.sep;

  if (
    filePath !== root &&
    !filePath.startsWith(allowedRoot)
  ) {
    throw new Error(
      "Invalid upload file path."
    );
  }

  return filePath;
}

export async function deleteUploadFile(url) {
  const filePath =
    uploadUrlToFilePath(url);

  if (!filePath) return;

  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function deleteProjectUploadDirectory(
  projectId
) {
  const directory =
    getProjectUploadDirectory(projectId);

  await rm(directory, {
    recursive: true,
    force: true,
  });
}