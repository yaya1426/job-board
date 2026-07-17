# Lecture 112 - Setting Up DigitalOcean Spaces | إعداد مساحة التخزين

## Goal

Finish and verify the infrastructure needed for private, direct resume uploads.

## Explain It Simply (For Beginners)

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

### 3. Configure CORS (Optional — Skip for This Course)

**Our server-proxied upload does not need CORS**, because the browser never talks to Spaces directly — it only talks to our own server. You can skip this step.

Only if you later switch to presigned **direct browser uploads** would you configure CORS on the Space, allowing the exact origins that upload files:

```txt
http://localhost:3000
https://dev.wazifa.app
https://wazifa.app
```

In that case, allowed methods should include `PUT`, allow the headers needed for `Content-Type`, and never use `*` for production origins when sensitive data is involved.

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
- Local variable names exist.
- Deployment variable names exist.
- SDK packages are installed.
- No secret value is committed or shown in the recording.
- (CORS is not required for the server-proxied flow — only for optional direct browser upload.)

## Key Teaching Lines

> The endpoint is used by the S3 client. The CDN URL is not a substitute for private authorization.

> Infrastructure configuration is complete only when local and deployed environments use the same variable contract.

## Next

Lecture 113 creates the storage client, validates the uploaded file, and stores it privately in Spaces.
