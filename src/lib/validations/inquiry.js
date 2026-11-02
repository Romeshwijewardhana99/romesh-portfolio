import { z } from "zod";

export const INQUIRY_STATUSES = ["NEW", "READ", "REPLIED", "CLOSED"];
export const INQUIRY_FIELDS = ["name", "email", "phone", "company", "service", "budget", "timeline", "message", "website"];
const optionalText = (max) => z.string().trim().max(max).optional();

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().max(190).email("Please enter a valid email address.").transform((value) => value.toLowerCase()),
  phone: optionalText(30),
  company: optionalText(120),
  service: optionalText(120),
  budget: optionalText(100),
  timeline: optionalText(100),
  message: z.string().trim().min(20, "Please provide at least 20 characters about your project.").max(5000),
  website: optionalText(2000),
});

export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);
export const positiveIdSchema = z.union([
  z.number(),
  z.string().regex(/^[1-9]\d*$/).transform(Number),
]).pipe(z.number().int().positive().max(2147483647));

export const inquiryStatusChangeSchema = z.object({
  id: positiveIdSchema,
  status: inquiryStatusSchema,
});

export function hasHoneypot(input) {
  return input !== null && typeof input === "object" && typeof input.website === "string" && input.website.trim().length > 0;
}
