# AI Context — wazifa.app (Standalone)

> **How to use this file**
> Copy or attach this entire document when working with any AI agent on this project.
> It is self-contained: product context, architecture rules, implementation state, course narrative, and debugging notes — without requiring other repo files.
>
> **Repository:** Next.js 16 job platform (`wazifa.app`) — modular monolith, Udemy course codebase.
> **Last updated:** aligned with Udemy Days 0–11; Day 11 in progress.

---

## Agent Instructions

When modifying this codebase:

1. **Follow the layer flow** — Action/Component → Service → Repository → MongoDB. Never skip layers or import mongoose in components/services.
2. **Prefer minimal diffs** — match existing naming, patterns, and file layout. Do not over-abstract.
3. **Do not pretend mocks are real** — see Known Mocks & TODOs below.
4. **Do not remove deliberate placeholders** without an explicit task; they are course milestones.
5. **Pedagogy matters** — patterns are introduced because of felt pain; avoid premature optimization (e.g. no QStash until Day 16).
6. **Production-first** — changes should work deployed (Docker standalone, env vars, `force-dynamic` for DB pages).
7. **Path alias** — `@/` maps to project root.

---

## 1. What This Project Is

**wazifa.app** is a full-stack **job platform** built as a **single Next.js 16 application** (modular monolith). One codebase, one deployment, two product surfaces:

| Surface | Production | Staging | Route group |
|---------|------------|---------|-------------|
| Public client app | `wazifa.app` | `dev.wazifa.app` | `app/(client)/` |
| Admin dashboard | `admin.wazifa.app` | `dev-admin.wazifa.app` | `app/(admin)/dashboard/` |

**Public app:** landing, jobs list, job details, apply flow, signup/login.

**Admin dashboard:** overview, job management (create/edit/delete), applications (review, AI screening), users/candidates.

Hostname decides which surface you see — enforced in `proxy.ts` (Next.js 16 replacement for `middleware.ts`).

This repo is also the **hands-on codebase for a long-form Udemy course**. The product and curriculum grow together.

---

## 2. Course Learning Style

### Principles

- **Production-first** — deploy from Day 1; DNS, HTTPS, staging, branch rules are part of the product.
- **Spiral learning** — routing → layouts → services → repositories → auth → uploads → screening, each deeper.
- **Ship early, ship often** — each day ends with something deployed or verifiable on a real URL.
- **Pain-driven architecture** — repositories appear after Mongoose leaks (`_id`, `Date` in components).
- **Avoid premature optimization** — synchronous screening (Day 11) before QStash worker (Day 16).

### What the course is not

- Not a toy demo disconnected from deployment.
- Not theory-only — lectures map to real files.
- Not over-abstracted — two form patterns, one service/repository flow, explicit mocks where planned.

### Lecture numbering

Global numbers: Lecture 1 = Day 0 welcome; Lecture 6 = Day 1 create app; Lecture 110 = Day 11 plan. Udemy section titles match day README indexes.

---

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js **16.1.6** (App Router, Turbopack) |
| UI | React **19.2.3**, TypeScript **5**, Tailwind CSS **v4**, shadcn/ui |
| Auth | NextAuth.js **v4** (JWT, Credentials provider) |
| Database | MongoDB Atlas + Mongoose **9.5** |
| Validation | Zod **4.3** |
| File storage | DigitalOcean Spaces (private, server-proxied) |
| AI screening | OpenAI Files API + Responses API (structured output) |
| Deploy | DigitalOcean App Platform (Dockerfile, `output: "standalone"`) |
| DNS / CDN | Cloudflare |
| Workflow | GitHub — `feature/*` → `development` → `production`, release tags |

---

## 4. Architecture

### Layer flow (strict one direction)

```txt
Server Action / Route Handler / Server Component
  ↓
Service          ← zod validation, business rules, orchestration
  ↓
Repository       ← ONLY layer that imports mongoose / models / dbConnect
  ↓
MongoDB
```

**Rules**

- Components **must not** import models or call `dbConnect`.
- Services **must not** import mongoose or models.
- Repositories map `_id → id`, `Date → ISO string`, drop `__v`.
- Validation beside service: `services/<entity>/<entity>.validation.ts`.
- `lib/auth.ts` is **config only** — `authorize` delegates to `verifyCredentials()` in auth service.

### ServiceResult contract

```ts
type ServiceResult<T> =
  | { success: true; data?: T }
  | { success: false; errors?: Record<string, string[]> };
```

Feeds `useActionState` on the client. Actions return `{ errors }` on failure.

### Folder structure

```txt
app/
  (client)/              Public routes (jobs, landing)
  (admin)/dashboard/     Admin routes
  (auth)/                Login/signup (clean layout)
  actions/               Server Actions (thin)
  api/auth/[...nextauth]/ NextAuth catch-all
components/            UI by feature (jobs/, navbar/, ui/, auth/, …)
services/              Business logic per entity
repositories/          Mongo access + mappers
lib/                     db, auth, models, password, storage, openai, utils
types/                   Domain types + next-auth.d.ts augmentation
data/                    CandidateData.ts (mock only)
hooks/                   useCurrentUser.ts
proxy.ts                 Subdomain routing + admin JWT gate
next.config.ts           output: "standalone"
Dockerfile               multi-stage; ARG MONGO_URI in builder
```

### Two form patterns

| Pattern | Used for | Why |
|---------|----------|-----|
| Server Action + `useActionState` | CRUD (create job, apply) | Field errors flow to form |
| Plain client handler | Login, signup | Chain signup → signIn → router.push + refresh |

**Pattern A (CRUD):** `app/actions/<entity>/<entity>.action.ts` parses FormData, calls service, `revalidatePath(path, "layout")` on success.

**Pattern B (auth):** No `redirect()` in actions. Client calls `handleSignup` then `signIn("credentials", { redirect: false })` then `router.push(callbackUrl ?? "/")` + `router.refresh()`.

Default Pattern A. Use Pattern B only for chained async auth flows.

### Rendering & caching

Both `app/(client)/layout.tsx` and `app/(admin)/dashboard/layout.tsx` export:

```ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

Mongoose reads are **not** dynamic API access in Next.js — without this, build prerenders empty DB pages forever. Mutations still call `revalidatePath(..., "layout")`.

---

## 5. Database Conventions

### Connection (`lib/db.ts`)

- `dbConnect()` with `globalThis._mongoose` cache (dev hot-reload + serverless).
- Env var: **`MONGO_URI`** (not `MONGODB_URI`). Must include database name.
- Throws if missing.

### Models (`lib/models/*.model.ts`)

- Pattern: `mongoose.models.X || mongoose.model("X", schema)`.
- Implemented: `JobModel`, `ApplicationModel`, `UserModel`, `UserProfileModel`. **No CandidateModel.**
- `UserModel`: identity only (email, name, role, passwordHash).
- `User.role`: `CANDIDATE` | `ADMIN` from `types/Roles.ts`.
- `UserProfileModel`: `userId` (unique), `linkedin`, optional `resumeUrl`.

### Repository mappers

Private `toEntity(doc)`: `_id → id`, dates → ISO strings, drop `__v`. Never let ObjectId/Date cross server/client boundary.

### Application snapshot pattern

Applications store relationship IDs **and** submitted display snapshots (audit record):

- `candidateId`, `candidateName`, `candidateEmail`, `candidateLinkedin`, `candidateCoverLetter`, resume metadata
- `jobId`, `jobTitle`, `jobCompany`, `role` (snapshots)
- `aiScore`, screening status fields, `status` (SUBMITTED | REVIEW | SHORTLIST | INTERVIEW | REJECTED), `appliedDate`

Candidate/job can change later; application reflects what was submitted.

### Applicant counts

Derived via `$lookup` + `$size` on applications — not stored on job document.

### Passwords

- `lib/password.ts` — `hashPassword`, `verifyPassword`, `SALT_ROUNDS = 10`.
- `findUserByEmail` — no passwordHash in return type.
- `findUserByEmailWithPassword` — auth-only path.
- Never return `passwordHash` above repository auth path.

---

## 6. Authentication (Day 10 — complete)

NextAuth.js **v4**, JWT sessions (not v5 beta).

### Wired

- `app/api/auth/[...nextauth]/route.ts`
- `SessionProvider` in root `app/layout.tsx`
- `lib/auth.ts`: JWT strategy, `pages.signIn = "/login"`, CredentialsProvider `authorize` → `verifyCredentials`
- JWT/session callbacks copy `id` + `role` to session
- `types/next-auth.d.ts` augments Session, User, JWT

### Key flows

- **Signup:** bcrypt hash → create User + UserProfile → client auto `signIn` → navigate + `refresh`
- **Login:** `signIn(..., { redirect: false })` → inline error or navigate + `refresh`
- **Current user:** server `getCurrentUser()` from `lib/current-user.ts`; client `useCurrentUser()` for UI only
- **Profile:** not in JWT — fetch via `getCurrentUserProfile()` when needed
- **Apply:** `applyToJob` uses session `id`; guests see `ApplyAuthPrompt` with callback URLs

### Admin protection (layered)

1. `proxy.ts` — `getToken({ secret: NEXTAUTH_SECRET })` not `getServerSession`
2. `app/(admin)/dashboard/layout.tsx` — repeats admin check
3. Server Actions — `role === "ADMIN"` before mutations

**Proxy rules:** admin hosts redirect `/` → `/dashboard`; non-admin JWT → `/not-authorized`; no JWT → `/login?callbackUrl=/dashboard`. Public host `/dashboard` → `/`.

**Admin testing:** change user role to `ADMIN` in MongoDB, then logout/login (JWT must refresh).

**Not implemented:** admin seed script (manual role change today).

---

## 7. File Upload & AI Screening (Day 11 — in progress)

### Target flow

```txt
Apply form (PDF) → server upload → private DigitalOcean Spaces
  → save application (PENDING)
  → temporary OpenAI Files (user_data, 1h expiration)
  → Responses API structured screening (0–10 + summary)
  → persist COMPLETED / FAILED
  → admin: screening state + secure resume download
```

### Key files

- `lib/storage.ts`, `services/upload/` (or equivalent upload service)
- `lib/openai.ts`, `services/screening/`
- Resume route: `app/(admin)/dashboard/applications/[applicationId]/resume/route.ts`

### Known gaps vs lecture targets

- `screenApplication()` may be fire-and-forget vs awaited synchronous screening
- Transitional `aiScore: 0` placeholder in some paths
- Duplicate-application check TODO in `applyToJob`
- Active-job check TODO
- Day 11 = no queue/worker; Day 16 = QStash + protected worker

---

## 8. Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection (build + runtime on DigitalOcean) |
| `NEXTAUTH_SECRET` | JWT signing (proxy `getToken` must match) |
| `NEXTAUTH_URL` | e.g. `http://localhost:3000` locally |
| `DO_SPACES_ENDPOINT` | Spaces S3 endpoint |
| `DO_SPACES_REGION` | Spaces region |
| `DO_SPACES_ACCESS_KEY_ID` | Spaces key |
| `DO_SPACES_SECRET_ACCESS_KEY` | Spaces secret |
| `DO_SPACES_BUCKET` | Bucket name |
| `OPENAI_API_KEY` | OpenAI API |
| `OPENAI_MODEL` | Model id for Responses API |

Dockerfile builder stage: `ARG MONGO_URI` / `ENV MONGO_URI=$MONGO_URI` required for App Platform builds.

---

## 9. Deployment & Release Workflow

- **Platform:** DigitalOcean App Platform, Docker build, `node server.js` from standalone output.
- **Branches:** `feature/day-N-*` → `development` (staging) → `production` (tagged release).
- **Staging:** `dev.wazifa.app`, `dev-admin.wazifa.app`
- **Production:** `wazifa.app`, `admin.wazifa.app`
- Never push directly to production.

---

## 10. Known Mocks & TODOs

Do not pretend these are fully implemented:

| Area | State |
|------|-------|
| Candidates admin list | `services/candidates/candidates.service.ts` → static `data/CandidateData.ts` |
| Admin seeding | Manual MongoDB role change |
| Duplicate application check | TODO in `applyToJob` |
| Active-job check on apply | TODO |
| Screening polish | Partial (see Day 11 gaps) |
| Search, SEO, i18n, perf | Days 12–15 planned, not in code |
| Background screening worker | Day 16 planned (QStash) |

**Implemented (do not regress):** signup/login, JWT id+role, profile, navbar auth, protected actions, proxy admin gate, auth layout, Mongo jobs/applications, resume upload pipeline (mostly).

---

## 11. Conventions for New Code

### New entity checklist

1. `types/Entity.ts` — public shape with `id: string`
2. `lib/models/entity.model.ts`
3. `repositories/entity.repository.ts` — `toEntity`, `await dbConnect()` in every function
4. `services/entity/entity.service.ts` + `entity.validation.ts` — `ServiceResult`, `safeParse`, `z.flattenError`
5. Optional: `app/actions/entity/entity.action.ts` + `revalidatePath`

### Validation messages

Always human-readable: `z.string().min(1, "Title is required")`.

### Auth conventions

- Session fields: extend `types/next-auth.d.ts` first, then jwt callback (write) + session callback (read).
- Profile/LinkedIn/resume **not** in JWT.
- Server security: always `getCurrentUser()`, never trust client identity fields.

---

## 12. Health-Check Checklist

| Symptom | Likely fix |
|---------|------------|
| DB empty but Atlas has data | `MONGO_URI` missing DB name; env mismatch local vs deploy |
| "Only plain objects can be passed to Client Components" | Mapper leaking ObjectId/Date — fix repository |
| New job not appearing | Missing `revalidatePath` or `force-dynamic` on layout |
| Build: `MONGO_URI is not defined` | Dockerfile `ARG MONGO_URI` + build-time env on DO |
| `[next-auth][error][NO_SECRET]` | Missing `NEXTAUTH_SECRET` at runtime |
| `useSession` undefined forever | Missing `<SessionProvider>` in root layout |
| `role: undefined` in session | JWT/session callbacks or `next-auth.d.ts` augmentation |
| Navbar stale after login | Client forgot `router.refresh()` after `signIn` |
| NextAuth error page on login fail | Missing `redirect: false` on `signIn` |
| Stranded on `/signup` after success | No client navigation after signup; need auto signIn + push |
| `applyToJob` auth error while "logged in" | No session cookie on request; check SessionProvider |
| UserProfileNotFound for signed-in user | No `userprofiles` doc (pre-Lecture 102 user) |
| LinkedIn not prefilled | Page must call `getCurrentUserProfile()`, not `useSession()` |
| ADMIN in DB but `/not-authorized` | Old JWT — logout/login |
| Admin proxy redirects to login | `NEXTAUTH_SECRET` missing or mismatched |

---

## 13. Day-by-Day Journey (Udemy Curriculum)

### Day (0) — Course Setup & Production Mindset (Lectures 1–5)

Orientation only. Production mindset, spiral+ship, Next.js rationale, `wazifa.app` map.

### Day (1) — First Deployment (Ship Day) (6–10)

Next.js 16 + TS scaffold, first page, GitHub, Dockerfile, `standalone` output, DigitalOcean deploy.

### Day (2) — Domain, DNS & HTTPS Setup (11–18)

Cloudflare DNS, `wazifa.app` + `admin.wazifa.app`, HTTPS. Mostly infra, little code.

### Day (3) — App Router Fundamentals (19–29)

Mental model, layouts, nested/dynamic routes, params, Link. Milestone: home + jobs + jobs/[id].

### Day (4) — Route Groups & Admin Setup (30–37)

`proxy.ts`, route groups `(client)` / `(admin)`, admin dashboard routes, subdomain routing.

### Day (5) — Layouts (38–47)

Tailwind v4, shadcn/ui, brutalist design, client navbar/footer, admin sidebar layouts.

### Day (6) — Build Product UI with Mock Data (48–58)

Full UI on mocks: landing, jobs, admin dashboard, job CRUD UI, applications, users. `types/`, contexts.

### Day (7) — Staging and Branch Rules (59–65)

`dev.wazifa.app`, `dev-admin.wazifa.app`, feature → development → production, release tags.

### Day (8) — Backend Setup in Next.js (66–80)

Server Actions, services, Zod, `useActionState`, `ServiceResult`, refactor mocks behind services.

### Day (9) — Database Setup (81–93)

MongoDB + Mongoose, repositories, application snapshots, aggregation applicant counts, `force-dynamic`, Dockerfile `MONGO_URI`.

### Day (10) — Authentication (94–109) ✅

NextAuth v4, User + UserProfile, signup/login, current user, navbar auth, protected actions, proxy admin gate, auth layout, admin sidebar auth.

### Day (11) — File Uploading & AI Screening (110–125) 🔄

Spaces upload, resume on apply, screening states, OpenAI Files + Responses API, admin results. Supplementary: resume snapshot (114), Docker env vars (124.1).

### Planned (not in codebase)

| Day | Topic |
|-----|-------|
| 12 | Search, Filters, Pagination |
| 13 | SEO and Metadata |
| 14 | Performance and Caching |
| 15 | Multi Language Support |
| 16 | Scalable AI Screening (QStash worker) |

---

## 14. Teaching Style for Proposals

When suggesting changes:

- Prefer smallest step that teaches and works in production.
- Patterns from felt pain, not upfront ceremony.
- Ship incrementally; avoid premature abstraction.
- Keep pedagogical mocks until their planned day replaces them.

---

*End of standalone context. No other files required for agents to understand project scope, rules, and current implementation state.*
