# Self-hosted images

Sharp decodes and EXIF-rotates images, preserves aspect ratio, prevents enlargement,
and produces WebP at quality 82. Maximum width: covers 1600px, gallery 1800px,
profiles fit within 1200×1200px. Source limit: 8 MiB, 40 megapixels, still JPEG/PNG/WebP/AVIF only.
SVG, corrupt input and mismatched MIME types are rejected.

MySQL stores only relative `/uploads/...` URLs. Create a project first; cover
changes then save immediately on its edit page. Gallery uploads run sequentially
and report partial failures. Project deletion cascades gallery rows and cleans its
storage folder. No Cloudinary credentials or packages are required.

## Windows development

Keep database/auth values in `.env` and add:

```ini
UPLOAD_DIR="D:/romesh-portfolio-storage/uploads"
```

Restart the dev server. The app creates directories lazily. Storage must be
writable and outside the application directory. The catch-all Next.js route serves
`http://localhost:3000/uploads/projects/1/cover-<random>.webp` in development.

## Ubuntu / PM2

Replace `portfolio` with the user that actually runs Next.js/PM2:

```bash
sudo mkdir -p /var/www/romesh-portfolio-storage/uploads/projects
sudo chown -R portfolio:www-data /var/www/romesh-portfolio-storage
sudo find /var/www/romesh-portfolio-storage -type d -exec chmod 2750 {} \;
sudo find /var/www/romesh-portfolio-storage -type f -exec chmod 640 {} \;
```

The setgid directories preserve Nginx group-read access for new files. Do not use
world-write permissions. Keep storage outside deployment release directories.

Production `.env`:

```ini
UPLOAD_DIR="/var/www/romesh-portfolio-storage/uploads"
```

Release commands:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
# Restart your configured PM2 process with its production environment.
```

## Nginx

Inside the site's `server` block, before other regex locations:

```nginx
# Allow multipart overhead above the app's 8 MiB source limit.
client_max_body_size 9m;

location ~ ^/uploads/(?<upload_image>(?:projects/[1-9][0-9]*|profile)/[A-Za-z0-9][A-Za-z0-9._-]*\.(?:webp|jpg|jpeg|png|avif))$ {
    alias /var/www/romesh-portfolio-storage/uploads/$upload_image;
    autoindex off;
    disable_symlinks on;
    add_header X-Content-Type-Options nosniff;
    add_header Cache-Control "public, max-age=2592000, immutable";
    limit_except GET HEAD { deny all; }
}

location /uploads/ {
    return 404;
}

location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

The Nginx `http` block must include `/etc/nginx/mime.types`. Do not add `^~` to
the fallback `/uploads/` location, since the image regex must be evaluated.
The regex alias uses a named capture as required by
[Nginx](https://nginx.org/en/docs/http/ngx_http_core_module.html#alias). The static
handler returns 404 for absent files; `try_files $uri` is deliberately omitted
to avoid appending the URI to the captured alias path a second time.
Run `sudo nginx -t` before `sudo systemctl reload nginx` on your VPS.

## Backups and existing data

Back up both MySQL and uploads. Git deployments do not copy stored images.
Existing external image URLs are not downloaded or deleted automatically;
re-upload legacy remote images through admin before removing old provider assets.
The schema migration preserves image URLs and removes obsolete public-ID metadata.

Filesystem and database cannot share a transaction. Failed DB writes clean new
files; replacement cleans old files after commit. Failed post-commit cleanup is
logged rather than breaking the saved image. Abrupt termination can leave unused
files. Profile upload/delete now saves immediately through the settings
profile-image API. Include orphan review in storage maintenance.

## Manual checks

1. Log in, create a temporary project and confirm redirect to its edit page.
2. Upload/replace/delete a cover. Check WebP dimensions, relative MySQL URL, old
   file removal and `coverImage = NULL` after delete.
3. Upload multiple screenshots. Check previews, ordering, partial failures and
   deletion of both physical files and gallery rows.
4. Open an image's `/uploads/...` URL directly in Windows. Try corrupt/SVG/spoofed
   images, >8 MiB uploads, invalid IDs, unauthenticated requests and traversal.
5. Delete the project; confirm gallery cascade and storage folder cleanup.
6. Run lint, Prisma validation/generation and the production build.

Automated checks: `node --conditions=react-server --test tests/uploads.test.mjs`.
For API integration, run `npm run build` and `npm run start -- --port 3101`, then
`node scripts/test-image-uploads.mjs`. This script uses the database/storage
configuration from `.env`, creates a temporary test admin and project, logs in
through the real API and cleans its own fixtures. It does not change existing
admin credentials. Set `TEST_BASE_URL` to use another local server port.
