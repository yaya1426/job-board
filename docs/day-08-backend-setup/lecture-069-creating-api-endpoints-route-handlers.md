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

## Recording Outline

1. Show `app/api/hello/route.ts` hello-world example (scaffold only).
2. Explain file convention: `route.ts` next to or instead of `page.tsx`.
3. Compare JSON `Response.json()` to Server Action return values.
4. Name real project uses: NextAuth catch-all, signed resume download.
5. State course default: Server Actions for form mutations.

## Verify in Repo

```bash
find app -name "route.ts"
```

- `app/api/auth/[...nextauth]/route.ts` exports GET and POST from NextAuth handler.
- Resume route exists under admin applications (post–Day 11).
- No generic `app/api/jobs/route.ts` — intentional.

## Notes/Gaps

- Day 8 students may only see a demo handler; production auth route comes Day 10.
- Route Handlers run on Edge or Node depending on runtime export — not covered deeply yet.

## Next

Lecture 070 — when to pick Route Handlers vs Server Actions.
