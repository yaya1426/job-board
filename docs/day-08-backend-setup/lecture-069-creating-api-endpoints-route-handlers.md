# Lecture 69 - Creating API Endpoints in Next (Route Handlers)

## Goal
Introduce Route Handlers as the App Router equivalent of API routes — HTTP endpoints for non-form clients, webhooks, and third-party integrations.

## Implementation Status
**Partial in Day 8 scope.** Course defers most REST APIs; primary Route Handler today is NextAuth (`app/api/auth/[...nextauth]/route.ts`, Day 10). Admin resume download route added Day 11.

## Key Files
- `app/api/auth/[...nextauth]/route.ts` (Day 10)
- `app/(admin)/dashboard/applications/[applicationId]/resume/route.ts` (Day 11)
- Next.js docs: Route Handlers

## What Was Built
Conceptual coverage on Day 8:

- `route.ts` exports `GET`, `POST`, etc.
- Request/Response Web APIs.
- When you need HTTP semantics (status codes, headers, external callers).

Not built on Day 8:

- Custom REST CRUD for jobs — Server Actions chosen instead.

## Implementation steps
### Step 1

Create a hello-world scaffold (demo only): `app/api/hello/route.ts`:

```ts
export async function GET() {
  return Response.json({ message: "Hello" });
}
```

### Step 2

Describe file convention: `route.ts` exports HTTP verb functions (`GET`, `POST`, etc.) alongside or instead of `page.tsx`.

### Step 3

Open request/response Web APIs: `Request`, `Response.json()`, status codes, headers.

### Step 4

Open real project Route Handlers (not built on Day 8):
- `app/api/auth/[...nextauth]/route.ts` (Day 10)
- `app/(admin)/dashboard/applications/[applicationId]/resume/route.ts` (Day 11)

### Step 5

State course default: Server Actions for form mutations from the same app — no `app/api/jobs/route.ts`.

### Verify

```bash
find app -name "route.ts"
```

- No generic `app/api/jobs/route.ts` — intentional.
- `proxy.ts` matcher excludes `/api/` from host redirects.
- NextAuth route exports GET/POST (Day 10).

### End State

Defines Route Handlers as HTTP endpoints for external callers, auth protocols, and downloads. Day 8 is conceptual — production routes come later.

## Verify
```bash
find app -name "route.ts"
```

- `app/api/auth/[...nextauth]/route.ts` exports GET and POST from NextAuth handler.
- Resume route exists under admin applications (post–Day 11).
- No generic `app/api/jobs/route.ts` — intentional.

## Notes/Gaps
- At Day 8 may only see a demo handler; production auth route comes Day 10.
- Route Handlers run on Edge or Node depending on runtime export — not covered deeply yet.

## Next
Lecture 070 — when to pick Route Handlers vs Server Actions.
