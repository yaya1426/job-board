# Lecture 112 - Setting Up DigitalOcean Spaces | إعداد مساحة التخزين

## Goal

Finish and verify the infrastructure needed for private, direct resume uploads.

## Explain It Simply (For Beginners)

Before we write any upload code, the "cloud filing cabinet" needs to exist and be configured correctly. This lecture is pure setup — no app code — and it's mostly about **safety** and **matching names**.

DigitalOcean Spaces is just cloud storage for files (it behaves like Amazon S3, which is why we use the AWS S3 SDK to talk to it). Think of it as a **rented storage unit**:

- The **bucket** is your unit.
- The **access key + secret key** are the keys to the unit. If someone steals them, they can read or dump anything inside — so these never go in the browser and never get committed to git.
- **CORS** is the guard list at the gate: it says which websites (`localhost:3000`, `dev.wazifa.app`, etc.) are allowed to upload directly from a browser. Without it, the browser blocks the upload for security.

The most common beginner mistake here is a **name mismatch**: the code reads `DO_SPACES_BUCKET`, but the env variable is spelled differently, or exists locally but not on the deployed server. "It works on my machine" almost always means an env variable is missing in the other environment.

### Jargon decoder

- **Environment variable (env var)** = a secret/config value kept *outside* the code (in `.env.local` or the hosting dashboard) so secrets aren't hard-coded.
- **CORS** (Cross-Origin Resource Sharing) = browser security that blocks one website from calling another unless the other explicitly allows it.
- **CDN** = a fast public delivery network for files. Great for public images, **wrong** for private resumes — we deliberately don't use it as the resume access path.
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
- Upload with signed PUT URLs.
- Download with signed GET URLs.
- The CDN endpoint is optional for future public assets; a normal public CDN URL should not be the resume access mechanism.

## Recording Steps

### 1. Review the Existing Space

In DigitalOcean:

1. Open Spaces Object Storage.
2. Select the development Space.
3. Confirm region (`fra1` if that is the provisioned region).
4. Confirm the Space name.
5. Confirm file listing/public access is private.

Use separate Spaces for development and production.

### 2. Review Access Keys

Open DigitalOcean API → Spaces Keys.

- Create or locate a scoped key for this Space.
- Never show the secret on screen.
- Never prefix either credential with `NEXT_PUBLIC_`.

### 3. Configure CORS

Direct browser uploads require CORS on the Space.

Allow the exact development/public origins that upload files, for example:

```txt
http://localhost:3000
https://dev.wazifa.app
https://wazifa.app
```

Allowed methods should include `PUT`; allow the headers needed for `Content-Type`.

Do not use `*` for production origins when credentials or sensitive data are involved.

### 4. Verify Local Variable Names

Add these names to `.env.local`:

```env
DO_SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
DO_SPACES_REGION=fra1
DO_SPACES_BUCKET=wazifa-resumes-dev
DO_SPACES_ACCESS_KEY_ID=...
DO_SPACES_SECRET_ACCESS_KEY=...
DO_SPACES_PUBLIC_URL=https://wazifa-resumes-dev.fra1.cdn.digitaloceanspaces.com
```

`DO_SPACES_PUBLIC_URL` is informational/optional for the private-resume flow. Signed S3 URLs use the Spaces endpoint.

Restart the development server after changing `.env.local`.

### 5. Add Deployment Variables

Add the same variable names to the development DigitalOcean App:

- Mark access and secret keys as encrypted secrets.
- Use runtime availability.
- Repeat later with a production bucket and production credentials.

### 6. Confirm Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

These are already present in the current working tree; do not reinstall unless the lockfile is lost.

## Verification Checklist

- Space exists in the intended region.
- Space/object access is private.
- Scoped access key exists.
- CORS permits local, staging, and production upload origins.
- Local variable names exist.
- Deployment variable names exist.
- SDK packages are installed.
- No secret value is committed or shown in the recording.

## Key Teaching Lines

> The endpoint is used by the S3 client. The CDN URL is not a substitute for private authorization.

> Infrastructure configuration is complete only when local and deployed environments use the same variable contract.

## Next

Lecture 113 creates the storage client, validates file metadata, and generates signed upload/download URLs.
