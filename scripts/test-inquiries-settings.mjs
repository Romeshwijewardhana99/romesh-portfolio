import "dotenv/config";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, access, unlink } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import mariadb from "mariadb";
import bcrypt from "bcryptjs";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { encodeReply } = require("next/dist/compiled/react-server-dom-turbopack/client.node");
const base = process.env.TEST_BASE_URL || "http://localhost:3101";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const db = new URL(process.env.DATABASE_URL);
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(db.hostname), "Use a local development database for this test");
const connection = await mariadb.createConnection({
  host: db.hostname, port: Number(db.port || 3306), user: decodeURIComponent(db.username),
  password: decodeURIComponent(db.password), database: db.pathname.slice(1),
  allowPublicKeyRetrieval: ["localhost", "127.0.0.1", "[::1]"].includes(db.hostname),
});
const marker = randomBytes(8).toString("hex");
const email = `cms-test-${marker}@example.invalid`;
const adminEmail = `cms-admin-${marker}@example.invalid`;
const password = randomBytes(24).toString("hex");
const savedRows = await connection.query("SELECT * FROM site_settings ORDER BY id");
const originalSettings = savedRows[0];
const uploadedUrls = new Set();
let adminId;
let cookie;
let count = 0;
let settingsTouched = false;

function pass(message) { count++; console.log(`PASS ${message}`); }
async function request(url, options = {}, auth = true) {
  return fetch(base + url, {
    redirect: "manual", signal: AbortSignal.timeout(30000), ...options,
    headers: { origin: base, ...(auth && cookie ? { cookie } : {}), ...options.headers },
  });
}
async function action(file, name, args, route, auth = true) {
  const manifest = JSON.parse(await readFile(".next/server/server-reference-manifest.json", "utf8"));
  const [id] = Object.entries(manifest.node).find(([, value]) => value.filename === file && value.exportedName === name) || [];
  assert.ok(id, `Action ${name} missing; build first`);
  return request(route, { method: "POST", body: await encodeReply(args), headers: { "Next-Action": id, accept: "text/x-component" } }, auth);
}
async function status(id, value, auth = true) {
  return action("src/actions/inquiries.js", "updateInquiryStatus", [id, value], "/admin/inquiries", auth);
}
async function currentStatus(id) {
  return (await connection.query("SELECT status FROM inquiries WHERE id=?", [id]))[0]?.status;
}
async function submit(input) {
  return request("/api/inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }, false);
}
function profileFile(url) {
  assert.match(url, /^\/uploads\/profile\/profile-[a-f0-9]{32}\.webp$/);
  const root = path.resolve(process.env.UPLOAD_DIR);
  const file = path.resolve(root, url.slice("/uploads/".length));
  assert.ok(file.startsWith(root + path.sep));
  return file;
}

try {
  const invalid = await submit({});
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).errors.message);
  assert.equal((await request("/api/inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }, false)).status, 400);
  assert.equal((await submit({ message: "x".repeat(40000) })).status, 413);
  assert.equal((await request("/api/inquiries", { method: "POST", body: "not json" }, false)).status, 415);
  pass("public API rejects invalid fields, malformed JSON, oversized and non-JSON input");
  const input = {
    name: "CMS Integration Test", email: email.toUpperCase(), phone: "+94123456789", company: "Test company",
    service: "Test service", budget: "Under $500", timeline: "Within 1 month",
    message: "<script>alert('test')</script> Please build a portfolio with a CMS.",
    website: "", status: "CLOSED",
  };
  const spam = await submit({ ...input, website: "https://spam.invalid" });
  assert.equal(spam.status, 200);
  assert.equal((await connection.query("SELECT id FROM inquiries WHERE email=?", [email])).length, 0);
  pass("honeypot receives generic success without storing an inquiry");
  const response = await submit(input);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  const leads = await connection.query("SELECT * FROM inquiries WHERE email=?", [email]);
  assert.equal(leads.length, 1);
  const lead = leads[0];
  assert.equal(lead.email, email);
  assert.equal(lead.status, "NEW");
  pass("valid public submission persists normalized email with NEW status regardless of client status");

  const admin = await connection.query("INSERT INTO admin_users(name,email,passwordHash,role,isActive,createdAt,updatedAt) VALUES(?,?,?,'ADMIN',true,NOW(),NOW())",
    ["CMS integration test", adminEmail, await bcrypt.hash(password, 12)]);
  adminId = Number(admin.insertId);
  await status(lead.id, "CLOSED", false);
  assert.equal(await currentStatus(lead.id), "NEW");
  const unauthorized = await request("/api/admin/settings/profile-image", { method: "DELETE" }, false);
  assert.equal(unauthorized.status, 401);
  const login = await request("/api/admin/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: adminEmail, password }) }, false);
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie").split(";")[0];
  pass("admin mutations require authentication; real API login succeeds");

  const dashboard = await request("/admin");
  assert.equal(dashboard.status, 200);
  const html = await dashboard.text();
  const expected = Number((await connection.query("SELECT COUNT(*) AS total FROM inquiries WHERE status='NEW'"))[0].total);
  assert.match(html, new RegExp('New Inquiries</p>\\s*<p[^>]*>' + expected + '</p>'));
  assert.ok(html.includes("/admin/inquiries?status=NEW"));
  const listing = await request("/admin/inquiries?status=NEW");
  assert.equal(listing.status, 200);
  assert.ok((await listing.text()).includes(email));
  const detail = await request(`/admin/inquiries/${lead.id}`);
  const detailHtml = await detail.text();
  assert.equal(detail.status, 200);
  assert.ok(detailHtml.includes("&lt;script&gt;"));
  assert.ok(!detailHtml.includes("<script>alert('test')</script>"));
  pass("dashboard NEW count/filter link, inquiry list/detail and escaped message render correctly");
  await action("src/actions/inquiries.js", "markInquiryRead", [lead.id], `/admin/inquiries/${lead.id}`);
  assert.equal(await currentStatus(lead.id), "READ");
  await status(lead.id, "REPLIED");
  assert.equal(await currentStatus(lead.id), "REPLIED");
  await action("src/actions/inquiries.js", "markInquiryRead", [lead.id], `/admin/inquiries/${lead.id}`);
  assert.equal(await currentStatus(lead.id), "REPLIED");
  await status(lead.id, "CLOSED");
  assert.equal(await currentStatus(lead.id), "CLOSED");
  await action("src/actions/inquiries.js", "markInquiryRead", [lead.id], `/admin/inquiries/${lead.id}`);
  assert.equal(await currentStatus(lead.id), "CLOSED");
  await status(lead.id, "INVALID");
  await status(-1, "READ");
  assert.equal(await currentStatus(lead.id), "CLOSED");
  assert.ok(!(await (await request("/admin/inquiries?status=NEW")).text()).includes(email));
  assert.ok((await (await request("/admin/inquiries?status=CLOSED")).text()).includes(email));
  await status(lead.id, "READ");
  assert.equal(await currentStatus(lead.id), "READ");
  pass("READ/REPLIED/CLOSED, reopening, invalid status/ID and no auto-read downgrade verified");

  // Keep any original image on disk untouched while testing image replacement.
  settingsTouched = true;
  if (originalSettings) await connection.query("UPDATE site_settings SET profileImage=NULL WHERE id=?", [originalSettings.id]);
  const imageBytes = await sharp({ create: { width: 1600, height: 3000, channels: 3, background: "#557799" } }).png().toBuffer();
  async function uploadProfile() {
    const body = new FormData();
    body.append("file", new File([imageBytes], "portrait.png", { type: "image/png" }));
    const result = await request("/api/admin/settings/profile-image", { method: "POST", body });
    assert.equal(result.status, 200);
    const value = (await result.json()).image;
    uploadedUrls.add(value.url);
    return value;
  }
  const first = await uploadProfile();
  assert.ok(first.width <= 1200 && first.height <= 1200);
  assert.equal((await sharp(await readFile(profileFile(first.url))).metadata()).format, "webp");
  assert.equal((await connection.query("SELECT profileImage FROM site_settings ORDER BY id LIMIT 1"))[0].profileImage, first.url);
  const second = await uploadProfile();
  await assert.rejects(access(profileFile(first.url)), { code: "ENOENT" });
  await access(profileFile(second.url));
  pass("profile uploads save immediately, fit 1200x1200 and replacement removes previous test image");

  const form = new FormData();
  form.set("siteName", `CMS Test ${marker}`);
  form.set("heroBadge", "Available for testing");
  form.set("heroTitle", "A tested CMS hero");
  form.set("heroSubtitle", "Saved through the real settings server action.");
  form.set("email", "CONTACT@EXAMPLE.COM");
  form.set("phone", "+94123456789");
  form.set("whatsapp", "+94123456789");
  form.set("location", "Sri Lanka");
  form.set("githubUrl", "https://github.com/example");
  form.set("linkedinUrl", "https://www.linkedin.com/in/example");
  form.set("facebookUrl", "https://www.facebook.com/example");
  form.set("instagramUrl", "https://www.instagram.com/example");
  form.set("resumeUrl", "/resume/romesh-wijewardhana.pdf");
  form.set("seoTitle", `CMS SEO ${marker}`);
  form.set("seoDescription", "Integration-tested portfolio metadata.");
  await action("src/actions/site-settings.js", "updateSiteSettings", [{}, form], "/admin/settings", false);
  assert.notEqual((await connection.query("SELECT siteName FROM site_settings ORDER BY id LIMIT 1"))[0].siteName, `CMS Test ${marker}`);
  const saved = await action("src/actions/site-settings.js", "updateSiteSettings", [{}, form], "/admin/settings");
  assert.equal(saved.status, 200);
  const current = (await connection.query("SELECT * FROM site_settings ORDER BY id LIMIT 1"))[0];
  assert.equal(current.siteName, `CMS Test ${marker}`);
  assert.equal(current.email, "contact@example.com");
  assert.equal(current.availableForWork, 0);
  assert.equal(current.resumeUrl, "/resume/romesh-wijewardhana.pdf");
  assert.equal(current.profileImage, second.url);
  assert.equal(Number((await connection.query("SELECT COUNT(*) AS total FROM site_settings"))[0].total), Math.max(savedRows.length, 1));
  const settingsHtml = await (await request("/admin/settings")).text();
  assert.ok(settingsHtml.includes(`CMS Test ${marker}`));
  const publicHtml = await (await request("/")).text();
  assert.ok(publicHtml.includes(`CMS SEO ${marker}`));
  pass("authenticated singleton settings save persists fields, availability, local resume path and public metadata");
  form.set("githubUrl", "javascript:alert(1)");
  form.set("siteName", "Invalid settings fixture");
  await action("src/actions/site-settings.js", "updateSiteSettings", [{}, form], "/admin/settings");
  assert.equal((await connection.query("SELECT siteName FROM site_settings ORDER BY id LIMIT 1"))[0].siteName, `CMS Test ${marker}`);
  pass("invalid settings cannot overwrite saved values");
  assert.equal((await request("/api/admin/settings/profile-image", { method: "DELETE" })).status, 200);
  assert.equal((await connection.query("SELECT profileImage FROM site_settings ORDER BY id LIMIT 1"))[0].profileImage, null);
  await assert.rejects(access(profileFile(second.url)), { code: "ENOENT" });
  pass("profile delete clears DB and removes file");
  console.log(`All ${count} CMS integration checks passed.`);
} finally {
  // Restore pre-test settings, preserving original image files and timestamps.
  if (settingsTouched) {
    if (originalSettings) {
      const fields = Object.keys(originalSettings).filter((field) => field !== "id");
      await connection.query(`UPDATE site_settings SET ${fields.map((field) => `\`${field}\`=?`).join(",")} WHERE id=?`, [...fields.map((field) => originalSettings[field]), originalSettings.id]);
    } else {
      const rows = await connection.query("SELECT id, siteName, profileImage FROM site_settings ORDER BY id LIMIT 1");
      if (rows[0] && (rows[0].siteName === `CMS Test ${marker}` || uploadedUrls.has(rows[0].profileImage))) {
        await connection.query("DELETE FROM site_settings WHERE id=?", [rows[0].id]);
      }
    }
  }
  for (const url of uploadedUrls) await unlink(profileFile(url)).catch((error) => { if (error.code !== "ENOENT") throw error; });
  await connection.query("DELETE FROM inquiries WHERE email=?", [email]);
  if (adminId) await connection.query("DELETE FROM admin_users WHERE id=? AND email=?", [adminId, adminEmail]);
  await connection.end();
}
