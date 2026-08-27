# Lecture 25 - Route Params | معاملات المسار

## Goal

Read dynamic segment values from `params` in a Server Component page and use them to load job-specific content.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/jobs/[id]/page.tsx` — reads `params`, calls `getJob(id)`
- `services/jobs/jobs.service.ts` — job lookup by id (added in later days; Day 3 may have used inline/mock data)

## What Was Built

The job details page accepts `params: Promise<{ id: string }>` (Next.js 15+), awaits `id`, and uses it to fetch or display the correct job. This connects the URL segment to server-side data loading in an async Server Component.

## Implementation steps

### Step 1: Type `params` as a Promise

```11:13:app/(client)/jobs/[id]/page.tsx
type Props = {
  params: Promise<{ id: string }>;
};
```

Next.js 15+ passes `params` as a Promise — always `await` it before use.

### Step 2: Await and destructure `id`

```15:17:app/(client)/jobs/[id]/page.tsx
async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const result = await getJob(id);
```

Day 3: replace `getJob(id)` with displaying `id` in JSX. Service wiring comes Day 8.

### Step 3: Handle missing job

```26:34:app/(client)/jobs/[id]/page.tsx
  if (!result.success) {
    return <JobNotFound />;
  }

  const { data: job } = result;

  if (!job) {
    return <JobNotFound />;
  }
```

Day 3: a simple "Job not found" message is enough.

### Step 4: Use `id` in the page UI

The back link and apply form both use the same `id` from the URL:

```39:44:app/(client)/jobs/[id]/page.tsx
        <Link
          href="/jobs"
          className="font-mono text-sm text-muted-foreground hover:text-accent transition-none"
        >
          ← ALL POSITIONS
        </Link>
```

### Step 5: Contrast with client `useParams()`

Prefer reading `params` on the server for data-fetching pages. Reserve `useParams()` for client-only UI that does not load data.

## Verify
- `page.tsx` types `params` as `Promise<{ id: string }>`.
- `await params` runs before any lookup using `id`.
- Invalid id path renders not-found UI.
- `await params` is used before calling `getJob(id)`.
- Invalid id path renders `JobNotFound`.

## Outcome

Dynamic segment values are read from `await params` in async Server Components and used to load job-specific content.

## Notes / Gaps

- Day 3 may have displayed a static placeholder using `params.id` without DB.
- Admin routes use different param names (`jobId`, `applicationId`) — same API, different keys.
- `generateStaticParams` for SSG is not used; app uses `force-dynamic` layouts later for MongoDB.

## Next

[Lecture 26 - Link and Navigation](./lecture-026-link-and-navigation.md)
