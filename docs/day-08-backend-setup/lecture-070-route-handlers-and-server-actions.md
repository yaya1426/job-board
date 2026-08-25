# Lecture 70 - Route Handlers + Server Actions

## Goal

Give students a decision framework: Server Actions for form-driven mutations from the app UI; Route Handlers for HTTP APIs, auth protocols, downloads, and webhooks.

## Implementation Status

**Complete (conceptual).** Project follows the framework in practice.

## Key Files

- `app/actions/jobs/jobs.action.ts` — Server Action example
- `app/api/auth/[...nextauth]/route.ts` — Route Handler example
- `AGENTS.md` §6 Server Actions and Form Patterns

## What Was Built

Decision table (course defaults):

| Use case | Mechanism |
|----------|-----------|
| Admin create job form | Server Action |
| Apply to job form | Server Action |
| NextAuth OAuth/credentials protocol | Route Handler |
| Admin resume PDF download | Route Handler (signed URL redirect) |
| Future QStash worker (Day 16) | Route Handler |

## Recording Outline

1. Revisit create job flow end-to-end as Server Action.
2. Show why NextAuth cannot be a Server Action (needs standard HTTP verbs).
3. Discuss progressive enhancement: forms work without client JS via actions.
4. Anti-pattern: creating REST API just to call it from your own form in the same app.
5. Summarize: start with Server Actions; add Route Handlers when HTTP contract required.

## Verify in Repo

- `CreateJobForm` → `handleCreateJob` (no fetch to `/api/jobs`).
- NextAuth mounted at `/api/auth/*`.
- `proxy.ts` matcher excludes `/api/` from host redirects.

## Notes/Gaps

- Server Actions are POST under the hood — mention security (CSRF) briefly.
- External mobile app would force Route Handlers — out of scope for wazifa.app v1.

## Next

Lecture 071 — implement create job Server Action end-to-end.
