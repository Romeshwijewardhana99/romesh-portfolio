"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { submitInquiry } from "@/lib/inquiries";
import { INQUIRY_FIELDS, inquiryStatusChangeSchema, positiveIdSchema } from "@/lib/validations/inquiry";

function refreshInquiries(id) {
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  if (id) revalidatePath(`/admin/inquiries/${id}`);
}

// Retain the existing server-action entry point with the same shared validation.
export async function createInquiry(previousState, formData) {
  const input = Object.fromEntries(INQUIRY_FIELDS.map((field) => [field, formData.get(field) ?? ""]));
  const result = await submitInquiry(input);
  if (result.body.ok) refreshInquiries();
  return { success: result.body.ok, message: result.body.message, errors: result.body.errors || {} };
}

export async function updateInquiryStatus(inquiryId, status) {
  await requireAdmin();
  const parsed = inquiryStatusChangeSchema.safeParse({ id: inquiryId, status });
  if (!parsed.success) return { success: false, message: "Invalid inquiry or status." };
  try {
    const result = await prisma.inquiry.updateMany({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    if (!result.count) return { success: false, message: "Inquiry not found." };
    refreshInquiries(parsed.data.id);
    return { success: true };
  } catch (error) {
    console.error("Inquiry status update failed:", error.code || error.name);
    return { success: false, message: "Unable to update inquiry status." };
  }
}

export async function markInquiryRead(inquiryId) {
  await requireAdmin();
  const parsed = positiveIdSchema.safeParse(inquiryId);
  if (!parsed.success) return { success: false };
  try {
    const result = await prisma.inquiry.updateMany({
      where: { id: parsed.data, status: "NEW" }, data: { status: "READ" },
    });
    if (result.count) refreshInquiries(parsed.data);
    return { success: true };
  } catch (error) {
    console.error("Inquiry read update failed:", error.code || error.name);
    return { success: false };
  }
}

// Preserve the existing explicit delete action; no automatic lead deletion.
export async function deleteInquiry(inquiryId) {
  await requireAdmin();
  const parsed = positiveIdSchema.safeParse(inquiryId);
  if (!parsed.success) return { success: false };
  try {
    const result = await prisma.inquiry.deleteMany({ where: { id: parsed.data } });
    refreshInquiries(parsed.data);
    return { success: result.count > 0 };
  } catch (error) {
    console.error("Inquiry delete failed:", error.code || error.name);
    return { success: false };
  }
}
