import "server-only";

import { prisma } from "@/lib/prisma";
import { inquirySchema, hasHoneypot } from "@/lib/validations/inquiry";

export const INQUIRY_SUCCESS_MESSAGE = "Your inquiry has been sent successfully.";

export async function submitInquiry(input) {
  // Give bots the same response as real submissions without inserting a lead.
  if (hasHoneypot(input)) {
    return { status: 200, body: { ok: true, message: INQUIRY_SUCCESS_MESSAGE } };
  }
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: 400,
      body: { ok: false, message: "Please check the form fields.", errors: parsed.error.flatten().fieldErrors },
    };
  }
  const { name, email, phone, company, service, budget, timeline, message } = parsed.data;
  try {
    await prisma.inquiry.create({
      data: { name, email, phone: phone || null, company: company || null, service: service || null,
        budget: budget || null, timeline: timeline || null, message },
    });
    return { status: 200, body: { ok: true, message: INQUIRY_SUCCESS_MESSAGE } };
  } catch (error) {
    console.error("Inquiry submission failed:", error.code || error.name);
    return { status: 500, body: { ok: false, message: "Unable to send your inquiry right now. Please try again." } };
  }
}
