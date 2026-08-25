# Day 14 - Performance and Caching

## Goal

Make the app faster and more predictable under real usage by reviewing rendering strategy, database query performance, caching, indexes, and production diagnostics.

## Planning Status

**Planned — not in codebase.** App still uses broad `force-dynamic`; no performance pass, no index rollout beyond what Day 12 may add later.

## Lecture Index (147–154)

- [Lecture 147 - Measure Before Optimizing](./lecture-147-measure-before-optimizing.md)
- [Lecture 148 - Review Rendering Strategy](./lecture-148-review-rendering-strategy.md)
- [Lecture 149 - Avoid Overfetching](./lecture-149-avoid-overfetching.md)
- [Lecture 150 - MongoDB Indexes](./lecture-150-mongodb-indexes.md)
- [Lecture 151 - Cache Invalidation and Mutations](./lecture-151-cache-invalidation-and-mutations.md)
- [Lecture 152 - Split Server and Client Components](./lecture-152-split-server-and-client-components.md)
- [Lecture 153 - Loading and Error States](./lecture-153-loading-and-error-states.md)
- [Lecture 154 - Production Performance Checklist](./lecture-154-production-performance-checklist.md)

## Course Position

By this point the app has real auth, real database flows, file uploads, search, and SEO. Day 14 should be a production-readiness pass over performance and caching.

The current pain to show first:

- The app uses `force-dynamic` broadly to avoid stale DB data.
- Some pages may fetch more data than needed.
- List queries may need indexes.
- Server components and actions may refetch after mutations.
- The course needs a clear rule for when to cache and when not to cache.

## Proposed Lessons

### Lesson 1 - Measure Before Optimizing

Start with a simple principle:

> Performance work starts by finding the slow path, not guessing.

Measure:

- page load speed
- server response time
- Mongo query time
- large bundle/client components
- list pages with pagination

Potential tools:

- browser network panel
- server logs
- MongoDB Atlas query insights
- Lighthouse for public pages

### Lesson 2 - Review Rendering Strategy

Revisit the current strategy:

```ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

Explain why it was used:

- Mongoose reads do not automatically make pages dynamic in the way students may expect.
- The app needed correctness over caching during database integration.

Then teach where to keep it:

- auth-sensitive pages
- admin pages
- frequently changing dashboards

And where to consider more caching later:

- public landing page
- SEO-friendly public job pages if freshness rules are clear

Teaching point:

> Dynamic rendering is a correctness choice. Caching is a product freshness choice.

### Lesson 3 - Avoid Overfetching

Review pages that fetch multiple collections:

```txt
dashboard overview
admin applications
admin users
public jobs
job detail
```

Improve by:

- adding focused repository methods
- using projections
- avoiding full collection reads
- using pagination from Day 12

Teaching point:

> The fastest data is the data you do not fetch.

### Lesson 4 - MongoDB Indexes

Add indexes based on actual queries:

Possible indexes:

- `Job.title`
- `Job.company`
- `Job.type`
- `Application.status`
- `Application.jobId`
- `Application.candidateId`
- `User.email` unique
- `User.role`
- `UserProfile.userId` unique

Teaching point:

> Indexes should follow query patterns, not guesses.

### Lesson 5 - Cache Invalidation and Mutations

Review existing actions:

- create job
- apply to job
- signup/login/logout flows

Teach:

- when to call `revalidatePath`
- why `router.refresh()` is needed after auth state changes
- why Server Actions should return clear success/error states

Teaching point:

> Mutation code should say which pages became stale.

### Lesson 6 - Split Server and Client Components

Review client components:

- forms
- active nav links
- sign-out buttons
- filters if interactive

Make sure data-heavy components remain server-rendered where possible.

Teaching point:

> Use client components for browser behavior, not because a component renders UI.

### Lesson 7 - Loading and Error States

Improve perceived performance:

- `loading.tsx` where helpful
- meaningful empty states
- admin table skeletons if needed
- `error.tsx` for route groups

Teaching point:

> Performance is not only speed; it is also how clearly the app behaves while waiting or failing.

### Lesson 8 - Production Performance Checklist

End with a checklist:

- important pages load correctly after deploy
- no static-prerender DB surprises
- Mongo indexes match filters
- no pages fetch full collections unnecessarily
- auth redirects are fast
- admin dashboard does not expose public cache issues

## Expected End State

- Clear rendering/caching rules for the app.
- Mongo indexes added for common queries.
- Query methods avoid unnecessary full collection reads.
- Mutation flows intentionally revalidate/refresh.
- Client components are kept focused.
- Loading/error states are improved where they affect user trust.

## Open Decisions

- Whether any public job pages should use time-based revalidation.
- Whether to cache public jobs listing after search/filter work.
- Whether to add dedicated monitoring/logging in this day or a later production day.

## Production Notes

- Avoid caching personalized pages.
- Avoid caching admin data publicly.
- Use staging to test deploy-time rendering behavior.
- Keep performance changes measurable.
- Do not add complex caching until data freshness rules are clear.
