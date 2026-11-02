import { revalidatePath } from "next/cache";
import { submitInquiry } from "@/lib/inquiries";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 32 * 1024;

export async function POST(request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return Response.json({ ok: false, message: "Please send JSON data." }, { status: 415 });
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return Response.json({ ok: false, message: "Your inquiry is too large." }, { status: 413 });
  }
  let input;
  try {
    if (!request.body) throw new Error("Missing body");
    const reader = request.body.getReader();
    const chunks = [];
    let length = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > MAX_BODY_BYTES) {
          await reader.cancel();
          return Response.json({ ok: false, message: "Your inquiry is too large." }, { status: 413 });
        }
        chunks.push(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return Response.json({ ok: false, message: "Invalid request data." }, { status: 400 });
  }
  const result = await submitInquiry(input);
  if (result.body.ok) {
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
  }
  return Response.json(result.body, { status: result.status });
}
