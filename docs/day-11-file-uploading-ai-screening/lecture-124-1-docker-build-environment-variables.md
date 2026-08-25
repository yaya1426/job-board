# Lecture 124.1 - Docker Build Environment Variables | متغيرات البيئة أثناء بناء Docker

## Goal

Fix the DigitalOcean Docker build after adding Spaces and OpenAI services, and explain the difference between:

```txt
local environment variables
DigitalOcean variable scope
Docker build arguments
container runtime variables
```

This is a complementary troubleshooting lecture after the Day 11 feature-branch deployment.

## Problem to Show

The application works locally because `.env.local` contains:

```txt
DO_SPACES_*
OPENAI_API_KEY
OPENAI_MODEL
```

The DigitalOcean build fails during:

```txt
Collecting page data
```

with an error such as:

```txt
Error: Failed to collect configuration for /dashboard/users
Caused by: DO_SPACES_ENDPOINT is required
```

The `/dashboard/users` route is not uploading a resume. It still imports the application service:

```txt
/dashboard/users
  -> applications.service.ts
  -> uploads.service.ts
  -> lib/storage.ts
  -> requireEnv("DO_SPACES_ENDPOINT")
```

`lib/storage.ts` creates the S3 client immediately when the module is imported. Next.js evaluates that server module while collecting build information, so the variables must exist during `npm run build`.

The same issue can happen next with:

```txt
OPENAI_API_KEY is required
```

because `lib/openai.ts` also validates its variables during module evaluation.

## Implementation Status
**Partial** — Dockerfile build-arg pattern exists for `MONGO_URI`; Spaces/OpenAI build-time access may still need App Platform scope fixes.

## Key Files (as implemented today)
- `Dockerfile`
- `next.config.ts`

## Gaps vs This Lecture (if any)
- Confirm `DO_SPACES_*` and `OPENAI_*` variables have **Run and build time** scope on DigitalOcean if imported during `next build`.

## Step 1 - Explain Why `.env.local` Does Not Help Deployment

`.env.local` belongs to the developer machine and should remain ignored by Git.

It is not copied into the production image:

```txt
local .env.local     -> local development only
DigitalOcean config -> deployed application
```

Never solve the build by committing `.env.local` or hardcoding secrets in the Dockerfile.

## Step 2 - Explain DigitalOcean Scope vs Dockerfile Access

Selecting **Build and Runtime** in DigitalOcean makes a variable eligible for both phases.

For a custom Dockerfile, the builder still needs to declare the value as an `ARG` before the `RUN npm run build` instruction can use it.

The current Dockerfile declares only:

```dockerfile
ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI
```

That explains why MongoDB is available during the build while the new Spaces and OpenAI variables are not.

## Step 3 - Update the Docker Builder Stage

Open:

```txt
Dockerfile
```

In the `builder` stage, replace:

```dockerfile
ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI
```

with:

```dockerfile
ARG MONGO_URI
ARG DO_SPACES_ENDPOINT
ARG DO_SPACES_REGION
ARG DO_SPACES_BUCKET
ARG DO_SPACES_ACCESS_KEY_ID
ARG DO_SPACES_SECRET_ACCESS_KEY
ARG OPENAI_API_KEY
ARG OPENAI_MODEL

ENV MONGO_URI=$MONGO_URI \
    DO_SPACES_ENDPOINT=$DO_SPACES_ENDPOINT \
    DO_SPACES_REGION=$DO_SPACES_REGION \
    DO_SPACES_BUCKET=$DO_SPACES_BUCKET \
    DO_SPACES_ACCESS_KEY_ID=$DO_SPACES_ACCESS_KEY_ID \
    DO_SPACES_SECRET_ACCESS_KEY=$DO_SPACES_SECRET_ACCESS_KEY \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    OPENAI_MODEL=$OPENAI_MODEL
```

The relevant builder section becomes:

```dockerfile
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG MONGO_URI
ARG DO_SPACES_ENDPOINT
ARG DO_SPACES_REGION
ARG DO_SPACES_BUCKET
ARG DO_SPACES_ACCESS_KEY_ID
ARG DO_SPACES_SECRET_ACCESS_KEY
ARG OPENAI_API_KEY
ARG OPENAI_MODEL

ENV MONGO_URI=$MONGO_URI \
    DO_SPACES_ENDPOINT=$DO_SPACES_ENDPOINT \
    DO_SPACES_REGION=$DO_SPACES_REGION \
    DO_SPACES_BUCKET=$DO_SPACES_BUCKET \
    DO_SPACES_ACCESS_KEY_ID=$DO_SPACES_ACCESS_KEY_ID \
    DO_SPACES_SECRET_ACCESS_KEY=$DO_SPACES_SECRET_ACCESS_KEY \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    OPENAI_MODEL=$OPENAI_MODEL

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi
```

Do not write actual values in the Dockerfile:

```dockerfile
# Never do this:
ENV OPENAI_API_KEY=sk-actual-secret
```

The Dockerfile contains variable names only. DigitalOcean supplies their values.

## Step 4 - Configure the DigitalOcean Develop Component

In the DigitalOcean App Platform dashboard:

1. Open the development application.
2. Open the web component settings.
3. Open environment variables.
4. Confirm these names exist exactly:

```txt
MONGO_URI
DO_SPACES_ENDPOINT
DO_SPACES_REGION
DO_SPACES_BUCKET
DO_SPACES_ACCESS_KEY_ID
DO_SPACES_SECRET_ACCESS_KEY
OPENAI_API_KEY
OPENAI_MODEL
```

5. Set their scope to **Build and Runtime** for the current eager-initialization implementation.
6. Mark credentials and connection strings as encrypted/secret values.
7. Use:

```txt
OPENAI_MODEL=gpt-5.6-terra
```

Environment-variable names are case-sensitive. A correctly scoped variable with the wrong name is still missing.

## Step 5 - Rotate Any Exposed Secret

If an API key was shown in:

```txt
chat
terminal output
video recording
Git history
screenshot
```

revoke it before redeploying:

1. Delete/revoke the exposed key in the provider dashboard.
2. Create a new project-scoped key.
3. Update `.env.local`.
4. Update the encrypted DigitalOcean variable.
5. Never reuse the exposed value.

## Step 6 - Verify Locally With a Production Build

Local `npm run dev` is not enough because it automatically reads `.env.local`.

Run:

```bash
npm run build
```

Expected:

```txt
Compiled successfully
TypeScript completed
Page data collected
Build completed
```

If a variable is missing, `requireEnv()` should name it directly. Add the missing variable rather than replacing validation with an empty fallback.

## Step 7 - Redeploy Development

Push the Dockerfile change through the project’s normal branch workflow and trigger a new development deployment.

Watch the build logs for:

```txt
Creating an optimized production build
Compiled successfully
Running TypeScript
Collecting page data
```

The build should continue past page-data collection instead of throwing `DO_SPACES_ENDPOINT is required`.

If DigitalOcean reuses an old failed image layer, trigger a clean rebuild from the latest commit.

## Step 8 - Verify Runtime Variables Too

A successful build proves only that the builder received the variables.

After deployment, verify runtime behavior with synthetic data:

1. Open the admin dashboard.
2. Open `/dashboard/users`.
3. Open `/dashboard/applications`.
4. Upload a small test PDF.
5. Open the private resume through the signed admin route.
6. Run one controlled OpenAI screening.
7. Confirm no secret appears in browser HTML, client JavaScript, or logs.

Build-time and runtime availability are separate checks:

```txt
build variable present   -> Next.js build succeeds
runtime variable present -> upload and screening requests succeed
```

## Why `/dashboard/users` Exposed the Problem

The error names the page being collected, not necessarily the feature using the missing variable.

The users page imports:

```ts
getApplications()
```

That imports the whole application service module. The application service imports the upload service, and the upload service imports the eager storage client.

Teaching point:

> Module imports connect features before a function is called. Eager configuration can therefore break an unrelated page during the build.

## Safer Follow-Up Architecture

Passing secrets into the builder fixes the current architecture, but the safer long-term design is lazy initialization:

```txt
import module during build
  -> do not read credentials yet

execute upload/screening at runtime
  -> read and validate credentials
  -> create/reuse the provider client
```

With lazy storage and OpenAI clients:

- the build does not require provider credentials
- secrets only need runtime scope
- unrelated page imports cannot fail because an unused provider is unavailable
- fewer secrets enter the image-build environment

That refactor is optional for this complementary lecture; do not mix it into the deployment fix unless you want to teach provider-client lifecycle separately.

## Common Mistakes

- Assuming `.env.local` is deployed.
- Selecting Build and Runtime but not declaring Docker `ARG`s.
- Adding only `DO_SPACES_ENDPOINT` and then failing on the next variable.
- Forgetting `OPENAI_MODEL`.
- Hardcoding a secret in the Dockerfile.
- Exposing secrets through `NEXT_PUBLIC_`.
- Verifying the build but not testing runtime upload/screening.
- Treating the page named in the build error as the root feature.

## Final Checklist

```txt
[ ] exposed keys rotated
[ ] .env.local remains ignored
[ ] Docker builder declares every required ARG
[ ] builder ENV maps each ARG without hardcoded values
[ ] DigitalOcean names match exactly
[ ] required variables use Build and Runtime scope
[ ] credentials are encrypted
[ ] npm run build succeeds
[ ] development deployment succeeds
[ ] admin pages load
[ ] private upload and signed download work
[ ] OpenAI screening works
[ ] no secret reaches client code or logs
```

## Next

Lecture 125 recaps the complete Day 11 workflow and its known synchronous-scaling limitation.
