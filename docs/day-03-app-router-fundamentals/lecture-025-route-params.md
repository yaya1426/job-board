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

## Recording Outline

- Open `app/(client)/jobs/[id]/page.tsx` and locate the `params` prop type.
- Explain Next.js 15+ convention: `params` is a **Promise** — use `const { id } = await params`.
- Connect `id` in the URL to the database/API lookup (`getJob(id)` today).
- Show what happens with a missing job: render not-found UI (`JobNotFound`).
- Contrast with client-side `useParams()` — prefer server read for data fetching pages.
- Warn: never trust `id` from the client for authorization; server still validates ownership on mutations.
- Demo changing the URL segment and seeing a different job (or not-found).
- Mention `searchParams` as sibling concept for query strings (`?page=2`) — Day 12 territory.
- Transition to client navigation with `<Link>`.

## Verify in Repo

- `page.tsx` types `params` as `Promise<{ id: string }>`.
- `await params` is used before calling `getJob(id)`.
- Invalid id path renders `JobNotFound`.

## Notes / Gaps

- Day 3 may have displayed a static placeholder using `params.id` without DB.
- Admin routes use different param names (`jobId`, `applicationId`) — same API, different keys.
- `generateStaticParams` for SSG is not used; app uses `force-dynamic` layouts later for MongoDB.

## Next

[Lecture 26 - Link and Navigation](./lecture-026-link-and-navigation.md)
