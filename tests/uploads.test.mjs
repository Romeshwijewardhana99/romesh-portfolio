import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, rm, writeFile, readFile, symlink } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";
import {
  getUploadRoot, parseProjectId, generateSafeFilename, publicUrlToFilePath,
  deleteUploadedFile, deleteProjectUploadDirectory, readUploadedFile,
  processImage, saveImage, readImageForm,
  toPublicUploadUrl,
} from "../src/lib/uploads.js";

let directory;
const previousRoot = process.env.UPLOAD_DIR;

before(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-image-tests-"));
  process.env.UPLOAD_DIR = path.join(directory, "uploads");
});

after(async () => {
  if (previousRoot === undefined) delete process.env.UPLOAD_DIR;
  else process.env.UPLOAD_DIR = previousRoot;
  await rm(directory, { recursive: true, force: true });
});

async function png(width = 2000, height = 1000) {
  return sharp({ create: { width, height, channels: 3, background: "#446688" } }).png().toBuffer();
}

test("validates IDs, filenames and isolated storage root", () => {
  assert.equal(parseProjectId("12"), 12);
  for (const id of ["../", 0, -1, "1.2", "NaN", "2147483648", "1e2"]) {
    assert.throws(() => parseProjectId(id));
  }
  const names = new Set(Array.from({ length: 50 }, () => generateSafeFilename("cover")));
  assert.equal(names.size, 50);
  for (const name of names) assert.match(name, /^cover-[a-f0-9]{32}\.webp$/);
  assert.throws(() => generateSafeFilename("../secret"));
  const filename = generateSafeFilename("cover");
  assert.equal(toPublicUploadUrl(1, filename), `/uploads/projects/1/${filename}`);
  for (const value of [
    `http://localhost:3000/uploads/projects/1/${filename}`,
    `/uploads/projects/1/${filename}`,
    `D:/storage/projects/1/${filename}`,
    `../${filename}`,
    `${filename}http:/localhost:3000/uploads/projects/1/${filename}`,
  ]) assert.throws(() => toPublicUploadUrl(1, value));
  const root = process.env.UPLOAD_DIR;
  process.env.UPLOAD_DIR = process.cwd();
  assert.throws(getUploadRoot, /outside/);
  delete process.env.UPLOAD_DIR;
  assert.throws(getUploadRoot, /UPLOAD_DIR/);
  process.env.UPLOAD_DIR = root;
});

test("processes, resizes, rotates and strips metadata", async () => {
  const large = new File([await png()], "untrusted.exe", { type: "image/png" });
  const result = await processImage(large, 1600);
  assert.equal(result.info.width, 1600);
  assert.equal(result.info.height, 800);
  assert.equal(result.info.format, "webp");
  const small = await processImage(new File([await png(20, 10)], "small.png", { type: "image/png" }), 1600);
  assert.equal(small.info.width, 20);
  const rotated = await sharp(await png(100, 50)).jpeg().withMetadata({ orientation: 6 }).toBuffer();
  const oriented = await processImage(new File([rotated], "rotated.jpg", { type: "image/jpeg" }), 1600);
  assert.equal(oriented.info.width, 50);
  assert.equal(oriented.info.height, 100);
  assert.equal((await sharp(oriented.data).metadata()).orientation, undefined);
});

test("accepts JPEG, WebP and AVIF sources", async () => {
  const source = await png(40, 20);
  for (const [format, type] of [["jpeg", "image/jpeg"], ["webp", "image/webp"], ["avif", "image/avif"]]) {
    const bytes = await sharp(source).toFormat(format).toBuffer();
    const processed = await processImage(new File([bytes], "source", { type }), 1600);
    assert.equal(processed.info.format, "webp");
    assert.equal(processed.info.width, 40);
  }
});

test("profile images fit within both 1200px dimensions", async () => {
  const portrait = await processImage(new File([await png(1600, 3000)], "portrait.png", { type: "image/png" }), 1200, 1200);
  assert.equal(portrait.info.height, 1200);
  assert.ok(portrait.info.width <= 1200);
});

test("rejects corrupt, SVG, spoofed MIME and oversized input", async () => {
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
  for (const file of [
    new File([svg], "x.svg", { type: "image/svg+xml" }),
    new File([svg], "x.png", { type: "image/png" }),
    new File(["corrupt"], "x.png", { type: "image/png" }),
    new File([await png(10, 10)], "x.jpg", { type: "image/jpeg" }),
    new File([new Uint8Array(8 * 1024 * 1024 + 1)], "huge.png", { type: "image/png" }),
  ]) await assert.rejects(processImage(file, 1600));
});

test("saves safe relative URLs and deletes only managed files", async () => {
  const saved = await saveImage(new File([await png()], "../../evil.png", { type: "image/png" }), { projectId: 12, kind: "gallery" });
  assert.match(saved.url, /^\/uploads\/projects\/12\/gallery-[a-f0-9]{32}\.webp$/);
  assert.equal(saved.width, 1800);
  assert.equal((await sharp(await readUploadedFile(saved.url)).metadata()).format, "webp");
  assert.ok(publicUrlToFilePath(saved.url).startsWith(getUploadRoot() + path.sep));
  for (const url of ["/uploads/../secret", "/uploads/projects/1/../../secret", "/uploads/%2e%2e/secret", "/uploads/C:/secret", "/uploads/projects\\secret"]) {
    assert.throws(() => publicUrlToFilePath(url));
  }
  assert.equal(publicUrlToFilePath("https://example.com/a.webp"), null);
  await deleteUploadedFile(saved.url);
  await deleteUploadedFile(saved.url);
  await assert.rejects(readUploadedFile(saved.url), { code: "ENOENT" });
  await deleteProjectUploadDirectory(12);
  await assert.rejects(deleteProjectUploadDirectory("../"));
});

test("refuses reads and deletes through symlinks/junctions", async () => {
  const outside = path.join(directory, "outside");
  const { mkdir } = await import("node:fs/promises");
  await mkdir(outside);
  const victim = path.join(outside, "safe.webp");
  await writeFile(victim, "do not delete");
  await symlink(outside, path.join(getUploadRoot(), "linked"), process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(readUploadedFile("/uploads/linked/safe.webp"));
  await assert.rejects(deleteUploadedFile("/uploads/linked/safe.webp"));
  assert.equal(await readFile(victim, "utf8"), "do not delete");
});

test("bounds multipart body and parses the file field", async () => {
  const body = new FormData();
  body.append("file", new File([await png(10, 10)], "test.png", { type: "image/png" }));
  const file = await readImageForm(new Request("http://localhost/upload", { method: "POST", body }));
  assert.equal(file.type, "image/png");
  await assert.rejects(readImageForm(new Request("http://localhost/upload", { method: "POST", body: "bad" })));
  await assert.rejects(readImageForm(new Request("http://localhost/upload", {
    method: "POST", body: "x", headers: { "content-type": "multipart/form-data; boundary=x", "content-length": String(10 * 1024 * 1024) },
  })));
});
