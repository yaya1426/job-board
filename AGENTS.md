# AGENTS.md

Persistent context for AI agents working on this project. This file is the source of truth for what is actually implemented. Update it whenever architecture, conventions, or major features change.

---

## 1. Project Overview

- **Product name**: wazifa.app — a full-stack job platform.
- **Type**: Single Next.js 16 application, modular monolith.
- **Surfaces served from one codebase**:
  - Client app (public): `wazifa.app`, `dev.wazifa.app`
  - Admin dashboard: `admin.wazifa.app`, `dev-admin.wazifa.app`
- **Routing model**: Host-based routing via `proxy.ts` (Next.js 16 replacement for `middleware.ts`). Subdomain decides which route group to redirect to.

This project is also the basis of a long-form course. Pedagogical narrative matters: prefer simple, incremental, production-realistic patterns over premature abstraction.

---

## 2. Tech Stack (Actual Versions)

From `package.json`:

- **Next.js**: `16.1.6` (App Router, Turbopack as default)
- **React**: `19.2.3`
- **TypeScript**: `^5`
- **MongoDB driver**: `mongoose ^9.5.0`
- **Validation**: `zod ^4.3.6`
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Icons**: `lucide-react`
- **Build output**: `output: "standalone"` (configured in `next.config.ts`) for minimal Docker image.
- **Deployment**: DigitalOcean App Platform (Dockerfile-based build).
- **DNS / CDN**: Cloudflare.

> Note: `@types/mongoose` is still installed but is obsolete for Mongoose v9. It can be removed.

---

## 3. Folder Structure

```
app/
  (admin)/dashboard/          ← Admin route group (admin.wazifa.app)
    layout.tsx                ← force-dynamic + revalidate=0
    page.tsx                  ← dashboard overview
    applications/
    jobs/
    users/
  (client)/                   ← Public route group (wazifa.app)
    layout.tsx                ← force-dynamic + revalidate=0
    page.tsx                  ← landing
    jobs/
  actions/                    ← Server Actions (form bindings)
    jobs/jobs.action.ts
    applications/applications.action.ts
  layout.tsx                  ← root layout
components/                   ← UI (route-grouped: jobs/, applications/, users/, dashboard/, navbar/, ui/, common/, landing/, job-management/)
context/                      ← Client-side React contexts (jobs/, applications/, users/)
data/                         ← Static mock data (CandidateData.ts is still live; JobsData/ApplicationsData removed since real DB)
lib/
  db.ts                       ← Mongoose singleton (globalThis cache)
  models/                     ← Mongoose schemas (Job, Application)
  utils.ts                    ← shared utilities (cn helper, etc.)
repositories/                 ← Mongo access layer (one .repository.ts per entity)
services/                     ← Business logic (one folder per entity)
  jobs/
    jobs.service.ts
    jobs.validation.ts        ← zod schemas + inferred types
  applications/
  candidates/                 ← Service exists but still returns static CandidateData
types/                        ← Domain types (Job, Application, Candidate, ServiceResult, StatusFilters)
utils/                        ← Cross-cutting helpers
proxy.ts                      ← Next.js 16 proxy (subdomain routing)
next.config.ts                ← output: "standalone"
Dockerfile                    ← multi-stage; builder stage declares ARG MONGO_URI
```

---

## 4. Architecture Layers

Strict one-direction flow:

```
Server Action / Route Handler / Server Component
        ↓
Service                 ← validation (zod) + business rules + orchestration
        ↓
Repository              ← ONLY layer that imports mongoose / models / dbConnect
        ↓
MongoDB
```

Rules:

- Components **must not** import models or call `dbConnect` directly.
- Services **must not** import `mongoose` or models directly.
- Repositories own the `_id → id` mapping and any `Date → string` normalization.
- Validation lives next to its service: `services/<entity>/<entity>.validation.ts` exports a zod schema and an inferred input type.

### ServiceResult contract

All service functions return:

```ts
type ServiceResult<T> =
  | { success: true; data?: T }
  | { success: false; errors?: Record<string, string[]> };
```

This shape feeds directly into `useActionState` on the client.

---

## 5. Database Conventions

### Connection (`lib/db.ts`)

- Single `dbConnect()` function.
- Uses a `globalThis._mongoose` cache to survive Next.js dev hot-reload and serverless cold starts.
- Reads `process.env.MONGO_URI` (note: variable name is `MONGO_URI`, not `MONGODB_URI`).
- Throws if env var is missing.

### Models (`lib/models/*.model.ts`)

- Use the pattern `mongoose.models.X || mongoose.model("X", schema)` to avoid `OverwriteModelError`.
- Currently implemented: `JobModel`, `ApplicationModel`. **No `CandidateModel` yet.**

### Repository mapper

Each repository defines a private `toEntity(doc): Entity` function that:

1. Converts `_id` → `id: string`.
2. Drops `__v`.
3. Converts any `Date` field into an ISO date string (`appliedDate`, `posted`, etc.) so Next.js can serialize across the server/client boundary.

### Application identity snapshot pattern

Applications store both **relationship IDs** and a **snapshot** of submitted display data:

```
candidateId        ObjectId, ref: Candidate
candidateName
candidateEmail
candidateLinkedin
candidateCoverLetter
candidateResume    (placeholder; file upload not implemented)
jobId              ObjectId, ref: Job
jobTitle           snapshot
jobCompany         snapshot
role               snapshot
aiScore
status             enum: SUBMITTED | REVIEW | SHORTLIST | INTERVIEW | REJECTED
appliedDate        Date
```

Rationale (must teach this): the candidate/job can change after applying, but the application document is an audit-style record of what was submitted at that time.

### Aggregation patterns

`findAllJobs` and `findJobById` use `$lookup` against the `applications` collection to compute `applicants: { $size: "$applications" }` at query time. Applicant counts are derived, not stored on the job document.

---

## 6. Server Actions

- Server Actions live in `app/actions/<entity>/<entity>.action.ts`.
- Each action:
  1. Parses `FormData` into a plain object.
  2. Calls the service function (which runs zod validation).
  3. Returns `{ errors }` on failure (matches `useActionState` shape).
  4. Calls `revalidatePath(path, "layout")` on success to invalidate any cached rendering.
- Actions remain thin; all business logic stays in the service.

---

## 7. Caching & Rendering Strategy

This was non-obvious and broke a prod build, so document explicitly:

- Both route group layouts (`app/(admin)/dashboard/layout.tsx` and `app/(client)/layout.tsx`) export:

  ```ts
  export const dynamic = "force-dynamic";
  export const revalidate = 0;
  ```

- Reason: this app uses Mongoose. Mongoose calls do **not** count as "dynamic API access," so without these exports Next.js would statically prerender pages at build time and serve stale empty data forever.
- `cacheComponents: true` is **not** enabled. We intentionally stick with `force-dynamic` because it's simpler to teach and predictable across minor Next versions.
- `revalidatePath` is still called in actions for belt-and-braces freshness and to bust the client router cache after mutations.

---

## 8. Deployment Setup

- Platform: DigitalOcean App Platform.
- Build: Docker via the `Dockerfile` at the repo root.
- The builder stage explicitly declares `ARG MONGO_URI` and exports it as `ENV MONGO_URI=$MONGO_URI`. This is required because App Platform does not pass runtime env vars into `docker build` automatically.
- The env variable on DigitalOcean must be named `MONGO_URI` with scope **Run and build time**.
- `next.config.ts` sets `output: "standalone"` so the runner stage can run `node server.js` with minimal files.

### Subdomains

- `wazifa.app` and `dev.wazifa.app` → client surface (`(client)` group).
- `admin.wazifa.app` and `dev-admin.wazifa.app` → admin surface (`(admin)/dashboard`).
- Logic lives in `proxy.ts`. The matcher excludes `/api`, static assets, and the favicon/SW.

---

## 9. Known Mocks & TODOs (Do Not Pretend These Are Real)

These are deliberate placeholders. When extending features, **don't quietly remove them**; they will be replaced in upcoming days of the course.

| Area | Current state | Planned in |
|------|---------------|------------|
| Authentication | None. `services/applications/applications.service.ts` hardcodes `candidateId: "69f21dc7e02f33189d6b08d8"` with a TODO. | Day 10 (NextAuth.js) |
| Authorization | None — anyone hitting admin subdomain has full access. | Day 11 |
| Candidates persistence | `services/candidates/candidates.service.ts` still returns the static `CandidateData` array. No `CandidateModel`. | Future |
| Resume file upload | `candidateResume` field exists on the application schema as a string placeholder. No upload pipeline. | Future (file uploads day) |
| Application active-job check | Marked TODO in `applyToJob`. | Future |
| Duplicate-application check | Marked TODO in `applyToJob`. | Future |
| Application validation (resume file) | `applications.validation.ts` validates text fields only. Single schema today; a separate `applyFormSchema` for `File` may be introduced when uploads land. | Future |

---

## 10. Conventions for New Code

### Adding a new entity

1. Create `types/Entity.ts` with the public domain shape (`id: string`, no `_id`).
2. Create `lib/models/entity.model.ts` (Mongoose schema + `models.X || model("X", schema)` guard).
3. Create `repositories/entity.repository.ts`:
   - Define a private `EntityLean` type and `toEntity` mapper.
   - Export `saveNew…`, `findAll…`, `findById`, plus any focused query methods.
   - Every function starts with `await dbConnect()`.
4. Create `services/entity/entity.service.ts` and `services/entity/entity.validation.ts`:
   - Service returns `ServiceResult<…>` everywhere.
   - Validation uses `safeParse` and converts via `z.flattenError(...).fieldErrors`.
5. If user-triggered, add a Server Action under `app/actions/entity/entity.action.ts` that calls the service and finishes with `revalidatePath`.

### Date and ObjectId handling

- Never let a `Date` or `ObjectId` leave the repository. Convert to `string` in the mapper.
- React + Next.js will throw "objects are not valid as a React child" or "only plain objects can be passed to Client Components" otherwise.

### Validation messages

- Always provide a human message: `z.string().min(1, "Title is required")`. Empty messages will surface as `undefined` in `useActionState` errors.

### Imports

- Path alias `@/` maps to project root.
- Use `import type { X } from "..."` for type-only imports where it avoids bringing runtime code along.

---

## 11. Course Day-by-Day Progress (Source of Truth)

Past days that are actually reflected in the codebase:

| Day | Topic | What's in the repo |
|-----|-------|--------------------|
| 0 | Course foundations | — |
| 1 | First deployment | Repo bootstrap, DigitalOcean deploy |
| 2 | Domain + HTTPS | Cloudflare DNS, prod domain |
| 3 | App Router fundamentals | Route groups under `app/`, dynamic segments e.g. `jobs/[id]` |
| 4 | Admin architecture + proxy | `proxy.ts`, `(admin)/` vs `(client)/` route groups, subdomain redirect rules |
| 5 | Layouts + design system | Tailwind v4, shadcn/ui, shared layouts, navbar/footer/sidebar |
| 6 | Full UI with mock data | `data/CandidateData.ts` still used; component-level pages for client + admin |
| 7 | Staging + branching | `feature/* → development → production` workflow, staging subdomains, release tags |
| 8 | Backend setup | Server Actions in `app/actions/`, services/repositories scaffolding, zod validation, `useActionState` integration |
| 9 | DB integration with MongoDB | `lib/db.ts` singleton, `lib/models/job.model.ts`, `lib/models/application.model.ts`, repositories with mappers, aggregation for applicants count, end-to-end "apply to job" flow with mock candidate, Dockerfile `ARG MONGO_URI`, `force-dynamic` layouts, `revalidatePath` in actions, deployed |

### Planned next

- **Day 10** — Authentication (NextAuth.js). Replace the hardcoded `candidateId` in `applyToJob` with the real session candidate.
- **Day 11** — Authorization and route protection (admin vs candidate).
- **Day 12+** — Performance, caching strategy, SEO, testing, CI/CD, AI screening, file uploads, i18n.

---

## 12. Teaching Style (Used by Course)

- Spiral learning: revisit topics deeper.
- Production-first: every concept lands as something deployed.
- Ship from day 1.
- Avoid premature optimization and excessive abstraction.
- Patterns are introduced **because of felt pain**, not as upfront ceremony (e.g., the repository layer was introduced only after writing Mongo code directly in the service and feeling the leak).

Keep this mindset when proposing changes: prefer the smallest reasonable step that teaches the concept and works in production.

---

## 13. Quick Health-Check Checklist (when something breaks)

- DB read returns empty but Atlas shows data → confirm `MONGO_URI` includes a database name (default is `test` if omitted). Both deploy env and `.env.local` must point at the same DB.
- "Only plain objects can be passed to Client Components" → a mapper is leaking `ObjectId` or `Date`; fix it in the repository.
- New job not appearing after create → check that the action calls `revalidatePath`, and that the layout exports `force-dynamic`.
- Build fails on DigitalOcean with `MONGO_URI is not defined` → Dockerfile must declare `ARG MONGO_URI`/`ENV MONGO_URI=$MONGO_URI` in the builder stage and the env var must have build-time scope.
- TypeScript complains about `instanceof Date` on a `string` field → widen the `Lean` type in the repository to `string | Date` for that field; final domain type stays `string`.
