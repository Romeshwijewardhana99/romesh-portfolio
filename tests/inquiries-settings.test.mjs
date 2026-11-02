import assert from "node:assert/strict";
import { test } from "node:test";
import { inquirySchema, inquiryStatusChangeSchema, positiveIdSchema, hasHoneypot } from "../src/lib/validations/inquiry.js";
import { siteSettingsSchema, resumeUrlSchema, profileImageSchema, getSettingsFormData, withSiteSettingsDefaults } from "../src/lib/validations/site-settings.js";

const inquiry = { name: "  Client Name  ", email: "  CLIENT@EXAMPLE.COM  ", message: "A useful project description with enough detail." };
const settings = {
  siteName: "Romesh Portfolio", email: "", githubUrl: "", linkedinUrl: "", facebookUrl: "", instagramUrl: "",
  resumeUrl: "", availableForWork: true,
};

test("inquiry validation trims and normalizes email without accepting client status", () => {
  const data = inquirySchema.parse({ ...inquiry, status: "CLOSED", id: 1, createdAt: "yesterday" });
  assert.equal(data.name, "Client Name");
  assert.equal(data.email, "client@example.com");
  assert.equal(data.status, undefined);
  assert.equal(data.id, undefined);
});

test("inquiries enforce required fields, bounds and input types", () => {
  for (const input of [null, [], {}, { ...inquiry, name: "x" }, { ...inquiry, name: "x".repeat(101) },
    { ...inquiry, email: "not-email" }, { ...inquiry, message: "short" }, { ...inquiry, message: "x".repeat(5001) },
    { ...inquiry, company: "x".repeat(121) }, { ...inquiry, phone: 123 }, { ...inquiry, service: "x".repeat(121) }]) {
    assert.equal(inquirySchema.safeParse(input).success, false);
  }
  assert.equal(inquirySchema.safeParse({ ...inquiry, phone: "", company: "", service: "", budget: "", timeline: "" }).success, true);
});

test("honeypot detects text without rejecting legitimate empty values", () => {
  assert.equal(hasHoneypot({ website: "https://spam.invalid" }), true);
  assert.equal(hasHoneypot({ website: "  " }), false);
  assert.equal(hasHoneypot({}), false);
  assert.equal(hasHoneypot(null), false);
});

test("status actions accept only supported states and positive database IDs", () => {
  for (const status of ["NEW", "READ", "REPLIED", "CLOSED"]) {
    assert.deepEqual(inquiryStatusChangeSchema.parse({ id: "12", status }), { id: 12, status });
  }
  for (const id of ["", "1e2", "1.5", "-1", 0, -1, 2147483648, {}, null]) assert.equal(positiveIdSchema.safeParse(id).success, false);
  assert.equal(inquiryStatusChangeSchema.safeParse({ id: 1, status: "DELETED" }).success, false);
});

test("settings allow blanks, normalize email and validate URL schemes", () => {
  assert.equal(siteSettingsSchema.safeParse(settings).success, true);
  assert.equal(siteSettingsSchema.parse({ ...settings, email: "  ADMIN@EXAMPLE.COM " }).email, "admin@example.com");
  assert.equal(siteSettingsSchema.safeParse({ ...settings, githubUrl: "https://github.com/example" }).success, true);
  for (const value of ["javascript:alert(1)", "data:text/html,x", "file:///secret", "not-url"]) {
    assert.equal(siteSettingsSchema.safeParse({ ...settings, githubUrl: value }).success, false);
  }
  assert.equal(siteSettingsSchema.safeParse({ ...settings, siteName: "x" }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...settings, heroTitle: "x".repeat(191) }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...settings, seoTitle: "x".repeat(71) }).success, false);
});

test("resume permits site paths while profile accepts only managed local image URLs", () => {
  for (const url of ["", "/resume/romesh-wijewardhana.pdf", "https://example.com/resume.pdf"]) assert.equal(resumeUrlSchema.safeParse(url).success, true);
  for (const url of ["//evil.invalid/file.pdf", "/../secret", "D:/secret.pdf", "javascript:alert(1)", "/resume/%2e%2e/secret", "/resume\\secret"]) {
    assert.equal(resumeUrlSchema.safeParse(url).success, false);
  }
  assert.equal(profileImageSchema.safeParse("/uploads/profile/profile-" + "a".repeat(32) + ".webp").success, true);
  assert.equal(profileImageSchema.safeParse("/uploads/../secret.webp").success, false);
  assert.equal(profileImageSchema.safeParse("D:/secret.webp").success, false);
});

test("settings defaults are safe and form save preserves separately uploaded profile", () => {
  const defaults = withSiteSettingsDefaults(null);
  assert.equal(defaults.siteName, "Romesh Portfolio");
  assert.equal(defaults.availableForWork, true);
  assert.equal(defaults.profileImage, null);
  assert.equal(withSiteSettingsDefaults({ id: 7, siteName: "Custom", availableForWork: false }).id, 7);
  assert.equal(withSiteSettingsDefaults({ availableForWork: false }).availableForWork, false);
  const form = new FormData();
  form.set("siteName", "Custom");
  form.set("availableForWork", "on");
  const data = getSettingsFormData(form);
  assert.equal(data.availableForWork, true);
  assert.equal("profileImage" in data, false);
  assert.equal(siteSettingsSchema.safeParse(data).success, true);
});
