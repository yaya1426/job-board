# Lecture 112 - Setting Up DigitalOcean Spaces | إعداد مساحة التخزين

## Goal
Finish and verify the infrastructure needed for private, direct resume uploads.

## Implementation Status
**Partial** — Spaces client/env wiring is in code; bucket provisioning is manual infrastructure.

## Key Files (as implemented today)
- `lib/storage.ts`
- `Dockerfile`

## Gaps vs This Lecture (if any)
- Space creation, keys, and DigitalOcean dashboard steps are off-repo.
- Verify all five `DO_SPACES_*` variables exist locally and on App Platform before recording upload demos.

## Implementation steps
1. In DigitalOcean: confirm private Space exists, region matches code (`fra1`), no public object ACL.
2. Create/locate scoped Spaces access keys — never `NEXT_PUBLIC_` prefix.
3. Add to `.env.local` (names must match `lib/storage.ts`):

```env
DO_SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
DO_SPACES_REGION=fra1
DO_SPACES_BUCKET=wazifa-resumes-dev
DO_SPACES_ACCESS_KEY_ID=...
DO_SPACES_SECRET_ACCESS_KEY=...
```

4. Mirror the same names on DigitalOcean App Platform (encrypted secrets, runtime scope minimum).
5. Confirm `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` are installed.
6. **Skip CORS** for server-proxied upload — only needed for future direct browser upload.

## Background
Before we write any upload code, the "cloud filing cabinet" needs to exist and be configured correctly. This lecture is pure setup — no app code — and it's mostly about **safety** and **matching names**.

DigitalOcean Spaces is just cloud storage for files (it behaves like Amazon S3, which is why we use the AWS S3 SDK to talk to it). Think of it as a **rented storage unit**:

- The **bucket** is your unit.
- The **access key + secret key** are the keys to the unit. If someone steals them, they can read or dump anything inside — so these never go in the browser and never get committed to git.

The most common beginner mistake here is a **name mismatch**: the code reads `DO_SPACES_BUCKET`, but the env variable is spelled differently, or exists locally but not on the deployed server. "It works on my machine" almost always means an env variable is missing in the other environment.

> Note on CORS: because we upload *through our server* (not directly from the browser to Spaces), we do **not** need to configure bucket CORS for this course's flow. CORS only matters if you later switch to presigned direct browser uploads. The section below is kept as optional/future reference.

### Jargon decoder

- **Environment variable (env var)** = a secret/config value kept *outside* the code (in `.env.local` or the hosting dashboard) so secrets aren't hard-coded.
- **CDN** = a fast public delivery network for files. Great for public images, **wrong** for private resumes — we deliberately don't use it as the resume access path.
- **CORS** (Cross-Origin Resource Sharing) = browser security that blocks one website from calling another unless the other explicitly allows it. Only relevant if the browser talks to Spaces directly — which it doesn't in our server-proxied flow.
- **`NEXT_PUBLIC_` prefix** = tells Next.js to ship that variable to the browser. *Never* put a secret key behind it.

## Current Status
- The development Space has already been provisioned.
- CDN was enabled with an endpoint similar to:

```txt
https://wazifa-resumes-dev.fra1.cdn.digitaloceanspaces.com
```

- AWS S3 client and presigner packages are installed.
- `.env.local` contains `DO_SPACES_ENDPOINT`, `DO_SPACES_REGION`, `DO_SPACES_BUCKET`, both credential names, and `DO_SPACES_PUBLIC_URL`.
- Deployment environment variables still need verification.

## Important Privacy Decision
Resumes contain personal data. Keep objects private.

- Do not add `ACL: "public-read"`.
- Upload through our server using the S3 client (`PutObject`), authenticated by the candidate's session.
- Download with short-lived signed GET URLs.
- The CDN endpoint is optional for future public assets; a normal public CDN URL should not be the resume access mechanism.

## Verification Checklist
- Space exists in the intended region.
- Space/object access is private.
- Scoped access key exists.
- Local variable names exist.
- Deployment variable names exist.
- SDK packages are installed.
- No secret value is committed or shown in the recording.
- (CORS is not required for the server-proxied flow — only for optional direct browser upload.)

## Key points
> The endpoint is used by the S3 client. The CDN URL is not a substitute for private authorization.

> Infrastructure configuration is complete only when local and deployed environments use the same variable contract.

## Next
Lecture 113 creates the storage client, validates the uploaded file, and stores it privately in Spaces.
