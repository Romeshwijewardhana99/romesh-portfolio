import "dotenv/config";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, access, rm } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import mariadb from "mariadb";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { encodeReply } = require("next/dist/compiled/react-server-dom-turbopack/client.node");
const base = process.env.TEST_BASE_URL || "http://localhost:3101";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Run only against a local test server");
const root = path.resolve(process.env.UPLOAD_DIR || "");
assert.ok(process.env.UPLOAD_DIR && path.isAbsolute(process.env.UPLOAD_DIR));
assert.ok(root !== process.cwd() && !root.startsWith(process.cwd() + path.sep));
const db = new URL(process.env.DATABASE_URL);
const connection = await mariadb.createConnection({
  host: db.hostname, port: Number(db.port || 3306),
  user: decodeURIComponent(db.username), password: decodeURIComponent(db.password),
  database: db.pathname.slice(1), allowPublicKeyRetrieval: ["localhost", "127.0.0.1", "[::1]"].includes(db.hostname),
});
const marker = randomBytes(8).toString("hex");
const email = `upload-test-${marker}@example.invalid`;
const password = randomBytes(24).toString("hex");
const fixtureIds = new Set();
let adminId;
let cookie;
let passed = 0;

function done(message) { passed++; console.log(`PASS ${message}`); }

async function request(url, options = {}, authenticated = true) {
  return fetch(base + url, {
    ...options,
    redirect: "manual",
    signal: AbortSignal.timeout(30000),
    headers: { origin: base, ...(authenticated ? { cookie } : {}), ...options.headers },
  });
}

async function upload(url, bytes, type = "image/png", authenticated = true) {
  const body = new FormData();
  body.append("file", new File([bytes], "../../client-filename.png", { type }));
  return request(url, { method: "POST", body }, authenticated);
}

function diskPath(url) {
  assert.match(url, /^\/uploads\/projects\/[1-9]\d*\/(?:cover|gallery)-[a-f0-9]{32}\.webp$/);
  const file = path.resolve(root, url.slice("/uploads/".length));
  assert.ok(file.startsWith(root + path.sep));
  return file;
}

async function action(name, args, page) {
  const manifest = JSON.parse(await readFile(".next/server/server-reference-manifest.json", "utf8"));
  const entry = Object.entries(manifest.node).find(([, value]) => value.filename === "src/actions/projects.js" && value.exportedName === name);
  assert.ok(entry, `Missing server action ${name}; run npm run build first`);
  const body = await encodeReply(args);
  return request(page, { method: "POST", body, headers: { "Next-Action": entry[0], accept: "text/x-component" } });
}

try {
  const admin = await connection.query(
    "INSERT INTO admin_users (name,email,passwordHash,role,isActive,createdAt,updatedAt) VALUES (?,?,?,'ADMIN',true,NOW(),NOW())",
    ["Upload integration test", email, await bcrypt.hash(password, 12)],
  );
  adminId = Number(admin.insertId);
  const login = await request("/api/admin/auth/login", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }),
  }, false);
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie?.startsWith("portfolio_admin_session="));
  done("real admin login");

  const data = new FormData();
  data.set("title", `Upload integration ${marker}`);
  data.set("slug", `upload-integration-${marker}`);
  data.set("shortDescription", "Temporary image integration test fixture.");
  data.set("description", "Temporary image integration test fixture for local uploads.");
  data.set("status", "DRAFT");
  data.set("sortOrder", "0");
  const created = await action("createProject", [{ success: false, message: "", errors: {} }, data], "/admin/projects/create");
  const projects = await connection.query("SELECT id FROM projects WHERE slug=?", [`upload-integration-${marker}`]);
  assert.equal(projects.length, 1, "Project action failed to create fixture");
  const id = Number(projects[0].id);
  fixtureIds.add(id);
  assert.ok(created.headers.get("x-action-redirect")?.startsWith(`/admin/projects/${id}/edit`));
  done("project creation action redirects to edit page");
  const coverApi = `/api/admin/projects/${id}/cover`;
  const galleryApi = `/api/admin/projects/${id}/images`;
  const png = await sharp({ create: { width: 2200, height: 1100, channels: 3, background: "#778899" } }).png().toBuffer();

  for (const [url, method] of [[coverApi, "POST"], [coverApi, "DELETE"], [galleryApi, "POST"], [`${galleryApi}/1`, "DELETE"]]) {
    assert.equal((await request(url, { method }, false)).status, 401);
  }
  done("all four image mutation APIs reject unauthenticated requests");
  assert.equal((await request("/api/admin/projects/not-an-id/cover", { method: "DELETE" })).status, 400);
  assert.equal((await request("/api/admin/projects/2147483647/cover", { method: "DELETE" })).status, 404);
  assert.equal((await request(coverApi, { method: "DELETE", headers: { origin: "https://other.invalid" } })).status, 403);
  done("invalid IDs, absent projects and cross-origin requests rejected");

  const cover = await upload(coverApi, png);
  assert.equal(cover.status, 200);
  const first = (await cover.json());
  assert.equal(first.width, 1600);
  assert.equal(first.height, 800);
  const stored = await connection.query("SELECT coverImage FROM projects WHERE id=?", [id]);
  assert.equal(stored[0].coverImage, first.url);
  assert.equal((await sharp(await readFile(diskPath(first.url))).metadata()).format, "webp");
  const served = await request(first.url, {}, false);
  assert.equal(served.status, 200);
  assert.equal(served.headers.get("content-type"), "image/webp");
  done("cover optimized, stored as relative URL, and served by catch-all route");

  const replaced = await upload(coverApi, png);
  assert.equal(replaced.status, 200);
  const second = await replaced.json();
  assert.notEqual(second.url, first.url);
  await assert.rejects(access(diskPath(first.url)), { code: "ENOENT" });
  assert.equal((await request(first.url, {}, false)).status, 404);
  done("replacement removes old physical cover");
  // A non-image edit must not overwrite a cover saved by the separate API.
  const updated = await action("updateProject", [id, { success: false, message: "", errors: {} }, data], `/admin/projects/${id}/edit`);
  assert.equal(updated.status, 200);
  assert.equal((await connection.query("SELECT coverImage FROM projects WHERE id=?", [id]))[0].coverImage, second.url);
  done("editing project text preserves independently saved cover");

  const gallery = [];
  for (let index = 0; index < 3; index++) {
    const response = await upload(galleryApi, png);
    assert.equal(response.status, 200);
    const image = (await response.json()).image;
    assert.equal(image.sortOrder, index);
    assert.equal(image.width, 1800);
    await access(diskPath(image.imageUrl));
    gallery.push(image);
  }
  done("multiple gallery uploads produce optimized files with ascending order");
  const wrongProject = await request(`/api/admin/projects/2147483647/images/${gallery[0].id}`, { method: "DELETE" });
  assert.equal(wrongProject.status, 404);
  await access(diskPath(gallery[0].imageUrl));
  assert.equal((await request(`${galleryApi}/${gallery[0].id}`, { method: "DELETE" })).status, 200);
  await assert.rejects(access(diskPath(gallery[0].imageUrl)), { code: "ENOENT" });
  assert.equal((await connection.query("SELECT id FROM project_images WHERE id=?", [gallery[0].id])).length, 0);
  done("gallery deletion verifies ownership and removes file plus row");

  for (const [bytes, type] of [["corrupt", "image/png"], ['<svg xmlns="http://www.w3.org/2000/svg"/>', "image/svg+xml"], ["<svg/>", "image/png"], [png, "image/jpeg"]]) {
    assert.equal((await upload(galleryApi, bytes, type)).status, 400);
  }
  assert.equal((await upload(galleryApi, new Uint8Array(8 * 1024 * 1024 + 1))).status, 413);
  done("corrupt, SVG, spoofed and oversized uploads rejected");
  assert.equal((await request("/uploads/projects/%2e%2e%5csecret.webp", {}, false)).status, 403);
  assert.equal((await request("/uploads/projects/1/absent.webp", {}, false)).status, 404);
  done("traversal and missing-file requests rejected");

  assert.equal((await request(coverApi, { method: "DELETE" })).status, 200);
  assert.equal((await connection.query("SELECT coverImage FROM projects WHERE id=?", [id]))[0].coverImage, null);
  await assert.rejects(access(diskPath(second.url)), { code: "ENOENT" });
  assert.equal((await request(coverApi, { method: "DELETE" })).status, 200);
  done("cover deletion clears database; repeated deletion is harmless");

  const finalCover = await upload(coverApi, png);
  assert.equal(finalCover.status, 200);
  const deletion = await action("deleteProject", [id], "/admin/projects");
  assert.equal(deletion.status, 200);
  assert.equal((await connection.query("SELECT id FROM projects WHERE id=?", [id])).length, 0);
  assert.equal((await connection.query("SELECT id FROM project_images WHERE projectId=?", [id])).length, 0);
  await assert.rejects(access(path.join(root, "projects", String(id))), { code: "ENOENT" });
  done("project deletion action cascades gallery and cleans project directory");
  console.log(`All ${passed} integration checks passed.`);
} finally {
  const leftovers = await connection.query("SELECT id FROM projects WHERE slug=?", [`upload-integration-${marker}`]);
  for (const project of leftovers) fixtureIds.add(Number(project.id));
  for (const id of fixtureIds) {
    assert.ok(Number.isInteger(id) && id > 0);
    await connection.query("DELETE FROM projects WHERE id=? AND slug=?", [id, `upload-integration-${marker}`]);
    const folder = path.resolve(root, "projects", String(id));
    assert.ok(folder.startsWith(root + path.sep));
    await rm(folder, { recursive: true, force: true });
  }
  if (adminId) await connection.query("DELETE FROM admin_users WHERE id=? AND email=?", [adminId, email]);
  await connection.end();
}
