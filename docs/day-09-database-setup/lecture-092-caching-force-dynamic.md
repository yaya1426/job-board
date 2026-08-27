# Lecture 092 - Caching Issues in Next.js | مشاكل التخزين المؤقت

## Goal
Fix stale and empty production pages by exporting `force-dynamic` and `revalidate = 0` on DB-backed layouts, using `revalidatePath(..., "layout")` after mutations, and passing `MONGO_URI` into the Docker build stage.

## Background
Next.js tries to be fast by pre-rendering pages at **build time**. That is great for marketing pages. It is dangerous for database pages.

Mongoose queries do **not** automatically mark a route as dynamic the way `cookies()` or `headers()` do. Without explicit config, Next.js may:

- Bake an empty job list into the build
- Serve that frozen HTML forever in production
- Ignore new jobs until another deploy

Day 9's fix is deliberate and teachable: **force dynamic rendering** for layouts that read MongoDB.

## Files
- `app/(client)/layout.tsx`
- `app/(admin)/dashboard/layout.tsx`
- `app/actions/jobs/jobs.action.ts`
- `app/actions/applications/applications.action.ts`
- `Dockerfile`

## Layout Exports
Both route-group layouts that touch DB-backed pages need:

```ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

## Mutation Cache Busting
After create job or apply:

```ts
revalidatePath("/jobs", "layout");
// or dashboard paths — use "layout" to bust nested routes
```

The `"layout"` scope invalidates child segments, not just one page.

## Docker Build-Time `MONGO_URI`
DigitalOcean does not inject runtime env vars into `docker build` automatically. The builder stage must declare:

```dockerfile
ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI
```

And the platform env var must have **Run and Build** scope. Otherwise the standalone build fails with `MONGO_URI is not defined`.

## Implementation steps
1. Add to both DB-backed layouts (`app/(client)/layout.tsx`, `app/(admin)/dashboard/layout.tsx`):

```ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

2. After mutations, call `revalidatePath` with `"layout"` scope:

```ts
revalidatePath("/dashboard/jobs", "layout");  // handleCreateJob
revalidatePath(`/jobs/${jobId}`);              // handleApplyToJob
```

3. Update `Dockerfile` builder stage:

```dockerfile
ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI
```

4. Set `MONGO_URI` on DigitalOcean with **Run and build time** scope.
5. Redeploy staging; create a job post-deploy without rebuilding — list must update.

## Key points
> Dynamic data needs dynamic rendering. Do not hope Mongoose counts as "dynamic enough."

> `revalidatePath` is belt-and-braces after mutations; layout `force-dynamic` is the foundation.

## End State
Production and staging show live MongoDB data. Mutations refresh the UI predictably.

## Next
Lecture 093 recaps Day 9.
