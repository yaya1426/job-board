# Day 3 - App Router Fundamentals

## Goal

Introduce the Next.js App Router mental model and build the first meaningful routes for the product.

## Lectures Covered

- Lecture 19 - Day 3 Plan
- Lecture 20 - App Router Mental Model
- Lecture 21 - App Router vs Pages Router
- Lecture 22 - Root Layout (Entrypoint)
- Lecture 23 - Nested Routes
- Lecture 24 - Dynamic Routes
- Lecture 25 - Route Params
- Lecture 26 - Link and Navigation
- Lecture 27 - Project Milestone: Core Routes
- Lecture 28 - Ship It: Deploy Checkpoint
- Lecture 29 - Recap Day 3

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
