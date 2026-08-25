# Day 3 - App Router Fundamentals

## Goal

Introduce the Next.js App Router mental model and build the first meaningful routes for the product.

## Lecture Index

- [Lecture 19 - Day 3 Plan](./lecture-019-day-3-plan.md)
- [Lecture 20 - App Router Mental Model](./lecture-020-app-router-mental-model.md)
- [Lecture 21 - App Router vs Pages Router](./lecture-021-app-router-vs-pages-router.md)
- [Lecture 22 - Root Layout (Entrypoint)](./lecture-022-root-layout.md)
- [Lecture 23 - Nested Routes](./lecture-023-nested-routes.md)
- [Lecture 24 - Dynamic Routes](./lecture-024-dynamic-routes.md)
- [Lecture 25 - Route Params](./lecture-025-route-params.md)
- [Lecture 26 - Link and Navigation](./lecture-026-link-and-navigation.md)
- [Lecture 27 - Project Milestone: Core Routes](./lecture-027-project-milestone-core-routes.md)
- [Lecture 28 - Ship It: Deploy Checkpoint](./lecture-028-ship-it-deploy-checkpoint.md)
- [Lecture 29 - Recap Day 3](./lecture-029-recap-day-3.md)

## Commit Evidence

Commit found for this day:

- `1a56240` - Day 3: Core Routes for Jobs

Changed files:

- `app/jobs/page.tsx`
- `app/jobs/[id]/page.tsx`
- `app/page.tsx`

## Final State

By the end of the day, the repo had:

- A home page.
- A jobs listing page.
- A dynamic job details page using `[id]`.

These routes were originally created without route groups. They were later moved into grouped route folders as the admin/public split emerged.

Current equivalent paths are:

- `app/(client)/page.tsx`
- `app/(client)/jobs/page.tsx`
- `app/(client)/jobs/[id]/page.tsx`

## Teaching Narrative

This day introduces the file-system router as the core mental model:

- Folder equals URL segment.
- `page.tsx` creates a route.
- `[id]` creates a dynamic segment.
- `layout.tsx` wraps child routes.
- `Link` provides client-side navigation.

The concrete milestone is a small job-board routing skeleton instead of abstract demo pages.

## Notes

- Later days changed the physical path names, but the App Router concepts from this day remain the foundation of the project.
