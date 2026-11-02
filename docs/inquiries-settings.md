# Inquiries and site settings

## Public inquiries

`POST /api/inquiries` accepts JSON fields `name`, `email`, `phone`, `company`,
`service`, `budget`, `timeline`, `message`, and a normally empty `website` field.
Name, email and a 20–5,000 character message are required. Shared Zod validation
trims text, lowercases email, and discards unknown fields. MySQL defaults status
to NEW; visitors cannot choose status. Honeypot submissions are not saved and
receive the same generic success message.

The complete request is limited to 32 KiB, including streaming bodies. Responses:
200 success, 400 invalid fields/JSON, 413 oversized body, 415 unsupported content
type, and generic 500 on save failure. No internal errors or stack traces are sent.
There is no email service; MySQL is the record of incoming leads.

`/contact` loads visible services, posts to the JSON API, shows server field
errors, blocks duplicate in-flight submissions and clears the form on success.
The existing `createInquiry` action uses the same save/validation logic.

## Admin inquiries

The list shows status counts, newest-first leads, service, budget, submitted date
and actions. Filters use URLs such as `/admin/inquiries?status=NEW` and
`?status=CLOSED`. The dashboard's New Inquiries count links to the NEW filter.

Opening a detail page mounts a client marker calling an authenticated action that
changes only NEW to READ. Rendering/prefetching does not mutate data, and the
conditional update cannot downgrade REPLIED/CLOSED inquiries. Admin controls
support all four statuses, including reopening CLOSED to READ. Mutations
revalidate dashboard/list/detail. The existing explicit delete action is retained;
there is no automatic lead deletion.

## Site settings

Readers and writers consistently use the first row ordered by ID. Missing data
returns defaults (`Romesh Portfolio`, availability enabled). The first authenticated
save creates the singleton automatically. Transactions serialize updates; first
creation uses a fixed-ID upsert. Existing extra rows are not deleted or merged.

General, Hero, Contact, Social Links, Profile and SEO sections reuse the existing
admin styling. Web URLs are optional HTTP(S) links. Resume also allows a local
path such as `/resume/romesh-wijewardhana.pdf`; PDF upload is not implemented.
Root metadata uses saved SEO title/description with safe fallbacks.
`getSiteSettings()` is shared by the public layout/footer, home and contact page.
React cache deduplicates reads within a render/request without persistent staleness.

## Profile images

Authenticated `POST /api/admin/settings/profile-image` accepts multipart field
`file`; DELETE clears the profile. Legacy POST `/api/admin/uploads/profile` is a
compatibility alias. Images save immediately, independently of text settings.
A text-only save cannot overwrite an image uploaded separately.

The secure local helpers EXIF-rotate and fit images within 1200×1200 without
enlargement, then write WebP quality 82 under `UPLOAD_DIR/profile`. MySQL stores
only `/uploads/profile/profile-<random>.webp`. Replacement cleans the old local
file after commit; deletion sets the DB field to null. Existing size/MIME/decode,
traversal and symlink protections remain. No Cloudinary is used.

## Verification

```bash
node --test tests/inquiries-settings.test.mjs
node --conditions=react-server --test tests/uploads.test.mjs
npm run lint
npx prisma validate
npx prisma generate
npm run build
```

For integration, run a built local server on port 3101, then:

```bash
node scripts/test-inquiries-settings.mjs
```

The script creates a temporary admin/lead, temporarily changes the effective
settings row, protects its original image, restores original settings and cleans
test fixtures. Use a local development database with no concurrent admin editing.
It refuses non-local servers/databases. Stop the test server and rebuild afterward
to regenerate static pages from restored settings.

Visual checks: submit invalid/valid inquiries, review details and status filters,
check dashboard counts, save settings and reload, then upload/replace/delete a
profile portrait. Verify WebP dimensions, relative DB URLs and physical cleanup.
No schema migration or dependency addition is needed.
