import { z } from "zod";

const text = (max) => z.string().trim().max(max).optional();
function isWebUrl(value) {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}
export const optionalWebUrl = z.string().trim().max(190).refine((value) => !value || isWebUrl(value), "Enter a valid HTTP or HTTPS URL.");
export const resumeUrlSchema = z.string().trim().max(190).refine((value) => {
  if (!value || isWebUrl(value)) return true;
  return /^\/(?!\/)[^\\\s?#%]+$/.test(value) && !value.split("/").some((part) => part === "." || part === "..");
}, "Enter a web URL or a local path such as /resume/your-name.pdf.");
export const profileImageSchema = z.string().trim().max(190).refine((value) => !value || /^\/uploads\/profile\/profile-[a-f0-9]{32}\.webp$/.test(value), "Upload a profile image using the image control.");

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required.").max(120),
  heroBadge: text(120), heroTitle: text(190), heroSubtitle: text(1000),
  email: z.string().trim().max(190).refine((value) => !value || z.email().safeParse(value).success, "Enter a valid email.").transform((value) => value.toLowerCase()),
  phone: text(40), whatsapp: text(40), location: text(150),
  githubUrl: optionalWebUrl, linkedinUrl: optionalWebUrl, facebookUrl: optionalWebUrl, instagramUrl: optionalWebUrl,
  profileImage: profileImageSchema.optional(),
  resumeUrl: resumeUrlSchema,
  availableForWork: z.boolean(),
  seoTitle: text(70), seoDescription: text(170),
});

export const DEFAULT_SITE_SETTINGS = {
  siteName: "Romesh Portfolio", availableForWork: true,
  heroBadge: "", heroTitle: "", heroSubtitle: "", email: "", phone: "", whatsapp: "", location: "",
  githubUrl: "", linkedinUrl: "", facebookUrl: "", instagramUrl: "", profileImage: null, resumeUrl: "",
  seoTitle: "", seoDescription: "",
};

export function withSiteSettingsDefaults(settings) {
  return { ...DEFAULT_SITE_SETTINGS, ...settings };
}

export function getSettingsFormData(formData) {
  const data = Object.fromEntries(Object.keys(DEFAULT_SITE_SETTINGS)
    .filter((field) => field !== "profileImage" && field !== "availableForWork")
    .map((field) => [field, formData.get(field) ?? ""]));
  data.availableForWork = formData.get("availableForWork") === "on";
  // A form saved while an image upload happens must not overwrite that image.
  if (formData.has("profileImage")) data.profileImage = formData.get("profileImage");
  return data;
}
