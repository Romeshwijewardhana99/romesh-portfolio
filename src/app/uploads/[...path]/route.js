import path from "node:path";
import { readUploadedFile, UploadError } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const CONTENT_TYPES = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".avif": "image/avif" };

export async function GET(request, { params }) {
  try {
    const segments = (await params).path;
    if (!Array.isArray(segments) || !segments.length) return new Response("Not found", { status: 404 });
    if (segments.some((segment) => !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(segment) || segment === "." || segment === "..")) {
      return new Response("Forbidden", { status: 403 });
    }
    const type = CONTENT_TYPES[path.extname(segments.at(-1)).toLowerCase()];
    if (!type) return new Response("Unsupported file type", { status: 415 });
    const data = await readUploadedFile(`/uploads/${segments.join("/")}`);
    return new Response(data, { headers: {
      "Content-Type": type, "Cache-Control": "public, max-age=2592000, immutable", "X-Content-Type-Options": "nosniff",
    } });
  } catch (error) {
    if (["ENOENT", "ENOTDIR", "EISDIR"].includes(error.code)) return new Response("Not found", { status: 404 });
    if (error instanceof UploadError) return new Response("Forbidden", { status: 403 });
    console.error("Upload read failed:", error.code || error.name);
    return new Response("Unable to read image", { status: 500 });
  }
}
