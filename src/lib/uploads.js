import "server-only";

import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, lstat, unlink, rm, writeFile, readFile } from "node:fs/promises";
import sharp from "sharp";

export const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_MULTIPART_SIZE = MAX_FILE_SIZE + 64 * 1024;
const MIME_FORMATS = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "heif",
};

export class UploadError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function parseProjectId(value) {
  if (!/^[1-9]\d*$/.test(String(value)) || Number(value) > 2147483647) {
    throw new UploadError("Invalid project or image ID.");
  }
  return Number(value);
}

export function getUploadRoot() {
  const root = process.env.UPLOAD_DIR;
  if (!root || !path.isAbsolute(root)) {
    throw new Error("UPLOAD_DIR must be an absolute storage directory.");
  }
  const resolved = path.resolve(root);
  const appRoot = path.resolve(/* turbopackIgnore: true */ process.cwd());
  if (resolved === appRoot || resolved.startsWith(appRoot + path.sep)) {
    throw new Error("UPLOAD_DIR must be outside the application directory.");
  }
  return resolved;
}

function assertContained(filePath) {
  const root = getUploadRoot();
  const relative = path.relative(root, filePath);
  if (!relative || relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) {
    throw new UploadError("Invalid upload path.");
  }
  return filePath;
}

// A local symlink/junction must never redirect reads or deletions outside storage.
async function assertNoSymlinks(filePath) {
  const root = getUploadRoot();
  assertContained(filePath);
  const relative = path.relative(root, filePath);
  let current = root;
  for (const segment of ["", ...relative.split(path.sep)]) {
    if (segment) current = path.join(current, segment);
    try {
      const stat = await lstat(current);
      if (stat.isSymbolicLink()) throw new UploadError("Invalid upload path.");
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
  }
}

export function getProjectUploadDir(projectId) {
  return assertContained(path.join(getUploadRoot(), "projects", String(parseProjectId(projectId))));
}

export async function ensureDirectory(directory) {
  await assertNoSymlinks(directory);
  await mkdir(directory, { recursive: true });
  await assertNoSymlinks(directory);
  return directory;
}

export function generateSafeFilename(prefix) {
  if (!["cover", "gallery", "profile"].includes(prefix)) throw new UploadError("Invalid image type.");
  return `${prefix}-${randomBytes(16).toString("hex")}.webp`;
}

export function toPublicUploadUrl(projectId, filename) {
  const id = parseProjectId(projectId);
  // Only a generated basename is accepted, never a URL or a filesystem path.
  if (typeof filename !== "string" || !/^(?:cover|gallery)-[a-f0-9]{32}\.webp$/.test(filename)) {
    throw new UploadError("Invalid image filename.");
  }
  return `/uploads/projects/${id}/${filename}`;
}

export function publicUrlToFilePath(url) {
  if (typeof url !== "string" || !url.startsWith("/uploads/")) return null;
  const segments = url.slice("/uploads/".length).split("/");
  if (segments.some((segment) => !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(segment) || segment === "." || segment === "..")) {
    throw new UploadError("Invalid upload path.");
  }
  return assertContained(path.resolve(getUploadRoot(), ...segments));
}

export async function deleteUploadedFile(url) {
  const filePath = publicUrlToFilePath(url);
  if (!filePath) return;
  await assertNoSymlinks(filePath);
  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export async function safelyDeleteUploadedFile(url) {
  try {
    await deleteUploadedFile(url);
  } catch (error) {
    console.error("Upload cleanup failed:", error.code || error.name);
  }
}

export async function deleteProjectUploadDirectory(projectId) {
  const directory = getProjectUploadDir(projectId);
  await assertNoSymlinks(directory);
  await rm(directory, { recursive: true, force: true });
}

export async function readUploadedFile(url) {
  const filePath = publicUrlToFilePath(url);
  if (!filePath) throw new UploadError("Image not found.", 404);
  await assertNoSymlinks(filePath);
  return readFile(/* turbopackIgnore: true */ filePath);
}

export async function readImageForm(request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    throw new UploadError("Upload an image using multipart form data.");
  }
  if (Number(request.headers.get("content-length")) > MAX_MULTIPART_SIZE) {
    throw new UploadError("Image must be 8 MB or smaller.", 413);
  }
  if (!request.body) throw new UploadError("Image file is required.");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_MULTIPART_SIZE) {
        await reader.cancel();
        throw new UploadError("Image must be 8 MB or smaller.", 413);
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const form = await new Response(Buffer.concat(chunks), {
      headers: { "content-type": request.headers.get("content-type") },
    }).formData();
    return form.get("file");
  } catch {
    throw new UploadError("Invalid upload form data.");
  }
}

export async function processImage(file, maxWidth, maxHeight) {
  if (!(file instanceof File) || !file.size) throw new UploadError("Image file is required.");
  if (file.size > MAX_FILE_SIZE) throw new UploadError("Image must be 8 MB or smaller.", 413);
  if (!MIME_FORMATS[file.type]) throw new UploadError("Only JPG, PNG, WebP and AVIF images are allowed.");
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const pipeline = sharp(buffer, { failOn: "warning", limitInputPixels: 40_000_000 });
    const metadata = await pipeline.metadata();
    if (metadata.format !== MIME_FORMATS[file.type] || (metadata.pages ?? 1) > 1 || (metadata.format === "heif" && metadata.compression !== "av1")) {
      throw new UploadError("Unsupported image format. Upload a still JPG, PNG, WebP or AVIF image.");
    }
    return await pipeline.rotate().resize({ width: maxWidth, ...(maxHeight ? { height: maxHeight, fit: "inside" } : {}), withoutEnlargement: true })
      .webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  } catch (error) {
    if (error instanceof UploadError) throw error;
    throw new UploadError("Image is corrupt, too large to decode, or unsupported.");
  }
}

export async function saveImage(file, { projectId, kind }) {
  const { data, info } = await processImage(file, kind === "gallery" ? 1800 : kind === "profile" ? 1200 : 1600, kind === "profile" ? 1200 : undefined);
  const directory = kind === "profile"
    ? path.join(getUploadRoot(), "profile")
    : getProjectUploadDir(projectId);
  await ensureDirectory(directory);
  const filename = generateSafeFilename(kind);
  const filePath = assertContained(path.join(directory, filename));
  try {
    await writeFile(filePath, data, { flag: "wx", mode: 0o640 });
  } catch (error) {
    // wx never overwrites an existing file, even on the unlikely name collision.
    if (error.code !== "EEXIST") await unlink(filePath).catch(() => {});
    throw error;
  }
  return {
    url: kind === "profile" ? `/uploads/profile/${filename}` : toPublicUploadUrl(projectId, filename),
    width: info.width,
    height: info.height,
  };
}
