# Lecture 70 - Route Handlers + Server Actions

## Goal
This section provides a decision framework: Server Actions for form-driven mutations from the app UI; Route Handlers for HTTP APIs, auth protocols, downloads, and webhooks.

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

## Implementation steps
### Step 1

Trace create job flow: `CreateJobForm` → `useActionState` → `handleCreateJob` → `createJob` service. No `fetch("/api/jobs")`.

### Step 2

Document why NextAuth uses a Route Handler: credentials/OAuth protocol needs standard HTTP verbs at `/api/auth/*`.

### Step 3

Open admin resume download as a Route Handler use case (Day 11): signed URL redirect, not a Server Action.

### Step 4

Discuss progressive enhancement: Server Action forms work without client JS.

### Step 5

Summarize decision rule: **start with Server Actions** for same-app form mutations; add Route Handlers when an HTTP contract is required (auth, webhooks, downloads, external clients).

### Verify

- `CreateJobForm` → `handleCreateJob` (no REST fetch).
- NextAuth mounted at `/api/auth/*`.
- `proxy.ts` matcher excludes `/api/`.

### End State

Readers can pick the right mechanism. wazifa.app v1 uses Server Actions for create/apply and Route Handlers only where HTTP semantics are required.

## Verify
- `CreateJobForm` → `handleCreateJob` (no fetch to `/api/jobs`).
- NextAuth mounted at `/api/auth/*`.
- `proxy.ts` matcher excludes `/api/` from host redirects.

## Notes/Gaps
- Server Actions are POST under the hood — mention security (CSRF) briefly.
- External mobile app would force Route Handlers — out of scope for wazifa.app v1.

## Next
Lecture 071 — implement create job Server Action end-to-end.
