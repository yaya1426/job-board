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

## Detailed Course Docs

Longer day-by-day implementation notes live in `docs/`. Keep `AGENTS.md` compact and operational; use these docs for teaching narrative, commit evidence, and historical detail.

- Day 1 - First Deployment: `docs/day-01-first-deployment.md`
- Day 2 - Domain, DNS and HTTPS: `docs/day-02-domain-dns-https.md`
- Day 3 - App Router Fundamentals: `docs/day-03-app-router-fundamentals.md`
- Day 4 - Route Groups and Admin Setup: `docs/day-04-route-groups-admin-setup.md`
- Day 5 - Layouts and Shared UI: `docs/day-05-layouts-shared-ui.md`
- Day 6 - Product UI with Mock Data: `docs/day-06-product-ui-mock-data.md`
- Day 7 - Staging and Branch Rules: `docs/day-07-staging-branch-rules.md`
- Day 8 - Backend Setup in Next.js: `docs/day-08-backend-setup.md`
- Day 9 - Database Setup: `docs/day-09-database-setup.md`
- Day 10 - Authentication: `docs/day-10-authentication.md`

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
  (admin)/not-authorized/     ← friendly non-admin access page
  (client)/                   ← Public route group (wazifa.app)
    layout.tsx                ← force-dynamic + revalidate=0
    page.tsx                  ← landing
    jobs/
    login/                    ← login page (Lecture 99) — server component, redirects if already signed in
    signup/                   ← signup page (Lecture 98) — server component, redirects if already signed in
  actions/                    ← Server Actions (form bindings)
    jobs/jobs.action.ts
    applications/applications.action.ts
    auth/auth.action.ts       ← handleSignup (Lecture 98)
  api/
    auth/[...nextauth]/route.ts  ← NextAuth catch-all (Lecture 96)
  layout.tsx                  ← root layout (wraps tree in SessionProvider)
components/                   ← UI (route-grouped: jobs/, applications/, users/, dashboard/, navbar/, ui/, common/, landing/, job-management/)
  auth/SignupForm.tsx         ← signup form (plain client handler; auto-`signIn` on success)
  auth/LoginForm.tsx          ← login form (plain client handler; calls `signIn("credentials")`)
  navbar/NavbarHeader.tsx     ← server navbar shell
  navbar/NavbarLinks.tsx      ← client active-link component (`usePathname`)
  navbar/NavbarAccount.tsx    ← server account area (`getCurrentUser`)
  navbar/SignOutButton.tsx    ← client sign-out click handler
  users/UserNotFound.tsx      ← simple missing-profile state used on apply page
  providers/SessionProvider.tsx    ← client wrapper around next-auth/react SessionProvider
context/                      ← Client-side React contexts (jobs/, applications/, users/)
data/                         ← Static mock data (CandidateData.ts is still live; JobsData/ApplicationsData removed since real DB)
hooks/
  useCurrentUser.ts           ← client hook over `useSession()`; reserved for client-only auth UI
lib/
  db.ts                       ← Mongoose singleton (globalThis cache)
  auth.ts                     ← NextAuth.js authOptions (JWT strategy)
  current-user.ts             ← server helper over `getServerSession(authOptions)`
  password.ts                 ← bcryptjs wrapper (hashPassword / verifyPassword)
  models/                     ← Mongoose schemas (Job, Application, User, UserProfile)
  utils.ts                    ← shared utilities (cn helper, etc.)
repositories/                 ← Mongo access layer (one .repository.ts per entity)
  jobs.repository.ts
  applications.repository.ts
  users.repository.ts
  user-profiles.repository.ts
services/                     ← Business logic (one folder per entity)
  jobs/
    jobs.service.ts
    jobs.validation.ts        ← zod schemas + inferred types
  applications/
  auth/                       ← signup/login services + validation
  users/                      ← user-related use cases, including current user profile
  candidates/                 ← Service exists but still returns static CandidateData
docs/                         ← Long-form day-by-day course implementation notes
types/                        ← Domain types (Job, Application, Candidate, User, UserProfile, Role, ServiceResult, StatusFilters)
  next-auth.d.ts              ← module augmentation: adds `id` + `role` to Session.user, User, JWT
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
- **Configuration files are config-only.** `lib/auth.ts` (NextAuth options) must not import from `repositories/` or `lib/password`. Its `authorize` delegates to a service function (`verifyCredentials`) instead. Same principle as "services don't import mongoose": each layer owns its concern.

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
- Currently implemented: `JobModel`, `ApplicationModel`, `UserModel`, `UserProfileModel`. **No `CandidateModel` yet.**
- `UserModel` holds **identity only** (email, name, role, passwordHash). Profile data (phone, skills, experience, etc.) is intentionally **not** on this model — those belong on a future `CandidateProfile` model.
- `User.role` is constrained by the `ROLES` const tuple from `types/Roles.ts` (`["CANDIDATE", "ADMIN"]`).
- `UserProfileModel` holds editable candidate profile data keyed by `userId` (`unique: true`). Current fields: `linkedin`, optional `resumeUrl`.

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

### Password handling

- All password operations go through `lib/password.ts` (`hashPassword`, `verifyPassword`). Services never call `bcryptjs` directly.
- `SALT_ROUNDS = 10`.
- `users.repository.ts` exposes two read methods on purpose:
  - `findUserByEmail(email)` → `User | null` (no `passwordHash` in the return type — safe for general use).
  - `findUserByEmailWithPassword(email)` → `(User & { passwordHash }) | null` (auth-only path).
- A service must never return `passwordHash` to the action/route layer.

---

## 6. Server Actions and Form Patterns

There are **two form patterns** in the app, used for two different reasons:

### Pattern A — Server Action + `useActionState` (CRUD)

Used for: `CreateJobForm`, `JobApplyForm`, etc.

- Server Actions live in `app/actions/<entity>/<entity>.action.ts`.
- Each action:
  1. Parses `FormData` into a plain object.
  2. Calls the service function (which runs zod validation).
  3. Returns `{ errors }` on failure (matches `useActionState` shape).
  4. Calls `revalidatePath(path, "layout")` on success to invalidate any cached rendering.
- Actions remain thin; all business logic stays in the service.
- Form binds with `action={formAction}` from `useActionState`. Field-level errors come back through `state.errors.<field>?.[0]` and feed `<Input error=… />`.

### Pattern B — Plain client handler (auth flows)

Used for: `LoginForm`, `SignupForm`.

- Authentication is a chained flow (call `signIn` or call action + `signIn`, then navigate). `useActionState`'s `formAction` doesn't expose a promise, which makes chaining awkward.
- The form's `action` prop binds to a plain async handler in the client component. Inside it:
  - Read `email`/`password` from `FormData` once and reuse them.
  - Call the Server Action directly (`await handleSignup(formData)`) or `signIn("credentials", { …, redirect: false })`.
  - Branch on the result, show inline errors via local `useState`, navigate with `useRouter().push` and `useRouter().refresh()`.
- Server Actions used by Pattern B (currently just `handleSignup`) drop the `prevState` parameter — they're called as plain async functions.
- `redirect()` is **not** used inside auth actions. The client orchestrates navigation because auth needs two steps (create + sign in) before navigating.

### Picking between the two

Default to Pattern A. Reach for Pattern B only when:

- Multiple async calls must run in sequence after submission (e.g. `handleSignup` then `signIn`).
- You need access to the resolved result of each call to decide what to do next (show inline error vs. navigate vs. fall back).

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

## 7b. Authentication (Day 10, in progress)

We use **NextAuth.js v4** (stable on Next.js 16) rather than v5 (still beta). Session strategy is **JWT**.

### What's wired

- `next-auth@^4` and `bcryptjs` installed.
- `.env.local`: `NEXTAUTH_SECRET` (generated), `NEXTAUTH_URL=http://localhost:3000`.
- `app/api/auth/[...nextauth]/route.ts` mounts the NextAuth handler.
- `components/providers/SessionProvider.tsx` re-exports `next-auth/react`'s `SessionProvider`; `app/layout.tsx` wraps the tree with it.

### `lib/auth.ts` (configuration only)

- `session.strategy = "jwt"`.
- `pages.signIn = "/login"`.
- `providers`: a single `CredentialsProvider` whose `authorize` is a 4-line delegate:
  ```ts
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;
    return verifyCredentials(credentials.email, credentials.password);
  }
  ```
- `callbacks.jwt`: writes `id` + `role` onto the token at sign-in (when `user` is present).
- `callbacks.session`: copies `id` + `role` from the token onto `session.user` on every read.
- `lib/auth.ts` **does not** import repositories, `bcryptjs`, or anything domain-specific. That's the rule.

### `services/auth/auth.service.ts`

Two exported functions:

- `signup(input)`: validates with `signupSchema`, enforces password match, checks email uniqueness, hashes with `lib/password.hashPassword`, persists via `saveNewUser`. Returns `ServiceResult<User>`.
- `verifyCredentials(email, password)`: looks up via `findUserByEmailWithPassword`, calls `verifyPassword`, returns `User | null`. **Does not** return the password hash. Used by `authorize`.

The two functions intentionally return different shapes: `ServiceResult<User>` for form-bound flows (signup), `User | null` for NextAuth's `authorize` contract (login).

### Type augmentation (`types/next-auth.d.ts`)

Adds `id` + `role` to `Session.user`, `User`, and `JWT` via module augmentation. Uses `extends DefaultUser` / `extends DefaultJWT` so we keep the built-in fields (`name`, `email`, `image`, `iat`, `exp`).

Without this, `user.role` and `token.role` red-squiggle in `lib/auth.ts`.

### Signup flow (Lecture 98 + Lecture 100 cleanup)

- `app/(client)/signup/page.tsx` — server component, calls `getCurrentUser()`; redirects to `/` if already signed in.
- `components/auth/SignupForm.tsx` — **plain client handler** (not `useActionState`):
  1. Reads `email`/`password` from `FormData` once.
  2. Calls `handleSignup(formData)` Server Action.
  3. On success, calls `signIn("credentials", { email, password, redirect: false })` with the same credentials.
  4. Navigates with `router.push(callbackUrl ?? "/") + router.refresh()`.
- `app/actions/auth/auth.action.ts` exports `handleSignup(formData)` returning `SignupResult = { errors } | undefined`. **No `redirect()` inside.** No `prevState` parameter — it's called as a plain async function.
- History/narrative: Lecture 98 introduced secure signup with bcrypt. Lecture 100 focused specifically on the successful-signup redirect/entry behavior, then cleaned it up into the current auto-login flow so a new user enters the app immediately instead of being sent back to a separate login step.

### Login flow

- `app/(client)/login/page.tsx` — server component, calls `getCurrentUser()`; redirects to `/` if already signed in.
- `components/auth/LoginForm.tsx` — plain client handler that calls `signIn("credentials", { …, redirect: false })`, displays inline error on failure, navigates on success with `router.push(callbackUrl ?? "/") + router.refresh()`.

### Current user helpers (Lecture 101)

- `lib/current-user.ts` exports `getCurrentUser()`, a server helper that calls `getServerSession(authOptions)` and maps the NextAuth session into the app's `User` type (`id`, `email`, `name`, `role`) or `null`.
- `/login` and `/signup` use `getCurrentUser()` to redirect already signed-in users to `/`.
- `hooks/useCurrentUser.ts` exports a client hook over `useSession()` and returns the same `User | null` shape. It is available for client-only auth UI, but server-owned operations still use `getCurrentUser()`.
- The client hook is for UI convenience only. Server actions/services must still call `getCurrentUser()` and must not trust client-submitted identity fields.

### User profile (Lecture 102)

- `types/UserProfile.ts` defines profile data separate from identity: `id`, `userId`, `linkedin`, optional `resumeUrl`.
- `lib/models/user-profile.model.ts` defines `UserProfileModel`; `userId` references `User` and is unique so each user has one profile.
- `repositories/user-profiles.repository.ts` owns profile persistence and mapping (`_id → id`, `userId → string`).
- `services/users/users.service.ts` exposes `getCurrentUserProfile()`. It calls `getCurrentUser()`, fetches the profile by `currentUser.id`, and returns a combined `(UserProfile & User)` object for pages that need both identity and profile fields.
- Signup now collects `linkedin` and `services/auth/auth.service.ts` creates both the `User` and the linked `UserProfile`.
- `app/(client)/jobs/[id]/page.tsx` calls `getCurrentUserProfile()` server-side. If the profile is missing, it renders `components/users/UserNotFound.tsx`; otherwise it passes the combined object into `JobApplyForm`.
- `components/jobs/JobApplyForm.tsx` receives `userProfile` as a prop and uses it to prefill name, email, and LinkedIn. It still submits these as snapshot fields, while `applyToJob` derives true ownership from the server session.
- LinkedIn/profile data is **not** stored in the JWT/session. Session remains for identity/authorization (`id`, `name`, `email`, `role`); profile is editable product data and is fetched when needed.

### Session-derived candidate id

`services/applications/applications.service.ts` no longer hardcodes a candidate id. `applyToJob` calls `getCurrentUser()` and uses `currentUser.id`. If there's no current user, it returns `ServiceResult` with `errors.auth = ["You must be logged in to apply"]`.

### Navbar auth state (Lecture 103)

- `components/navbar/NavbarHeader.tsx` remains a server component and owns the navbar shell/layout.
- `components/navbar/NavbarLinks.tsx` is a small client component because active link styling needs `usePathname()`.
- `components/navbar/NavbarAccount.tsx` remains server-side and calls `getCurrentUser()` to render either guest links (`LOGIN`, `SIGN UP`) or the signed-in user's name plus sign-out.
- `components/navbar/SignOutButton.tsx` is client-side because it handles a browser click and calls `signOut()` from `next-auth/react`.
- The middle nav links are styled as underline/active links rather than brutal bordered buttons.
- This is UX only. Hiding/showing navbar links is not authorization; server actions and admin pages still need protection in later lessons.

### Server Action protection + apply UX (Lecture 104)

- `components/jobs/ApplyAuthPrompt.tsx` replaces the confusing guest-facing `USER PROFILE NOT FOUND` state on job details pages.
- The apply prompt links to `/login?callbackUrl=/jobs/[id]` and `/signup?callbackUrl=/jobs/[id]`.
- `LoginForm` and `SignupForm` accept `callbackUrl` and navigate there after successful auth, then call `router.refresh()`.
- `applyToJob` still checks `getCurrentUser()` server-side before saving; the UI prompt is guidance, not security.
- `app/actions/jobs/jobs.action.ts` now checks `getCurrentUser()` and requires `role === "ADMIN"` before creating a job.
- `CreateJobForm` renders `errors.auth` and uses `isPending` for the submit button.

### Admin route protection with proxy (Lecture 105)

- `proxy.ts` uses `getToken({ req, secret: process.env.NEXTAUTH_SECRET })` from `next-auth/jwt` for route-level checks. Use `getToken()` in proxy, not `getServerSession()`.
- Admin hosts: `admin.wazifa.app`, `dev-admin.wazifa.app`.
- Public hosts: `wazifa.app`, `dev.wazifa.app`.
- Public host + `/dashboard` redirects to `/`.
- Admin host `/` redirects to `/dashboard`.
- Admin host non-dashboard public paths redirect to `/dashboard`, except `/login` and `/not-authorized`.
- Admin route with no JWT redirects to `/login?callbackUrl=/dashboard`.
- Admin route with non-admin JWT redirects to `/not-authorized`.
- Admin route with `role === "ADMIN"` continues.
- `app/(admin)/dashboard/layout.tsx` repeats the `getCurrentUser()` + `role === "ADMIN"` check as defense in depth.
- `app/(admin)/not-authorized/page.tsx` is the friendly non-admin page.
- Testing currently requires manually changing a user's MongoDB role to `ADMIN`, then logging out/in so the JWT picks up the updated role. Admin seeding is a later lesson.

### Not yet implemented (Day 11+)

- **Clean auth layout**: login/signup still render in the public layout with navbar/footer. Lecture 106 will introduce an auth-only layout that can support both public and admin auth flows.
- **Admin seeding**: no seed script/route yet. Admin role is manually changed in MongoDB during the lesson.
- **Candidates migration**: `services/candidates/candidates.service.ts` still returns mock data. To be replaced with `findUsersByRole("CANDIDATE")`.

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
| Signup | Implemented end-to-end with bcrypt hashing. Lecture 100 added and cleaned up the success redirect behavior into auto-login, so users enter the app immediately after signup. | ✅ Lectures 96–98, 100 |
| Login | `CredentialsProvider` with `authorize` delegating to `verifyCredentials` service. JWT sessions, `id` + `role` on `session.user`. Plain client form with `signIn`. | ✅ Lecture 99 |
| Current logged user | `lib/current-user.ts` exposes server `getCurrentUser()`. `hooks/useCurrentUser.ts` exposes the client-side session-derived user for UI convenience. | ✅ Lecture 101 |
| User profile | Signup collects LinkedIn and creates a linked `UserProfile`. `getCurrentUserProfile()` returns combined identity + profile data from the users service. | ✅ Lecture 102 |
| Session-derived candidate id | `applyToJob` reads `getCurrentUser()?.id`. Returns `errors.auth` if no user. | ✅ Lecture 101 |
| NextAuth type augmentation | `types/next-auth.d.ts` adds `id` + `role` to `Session.user`, `User`, `JWT` via `extends DefaultUser` / `extends DefaultJWT`. | ✅ Lecture 99 |
| Apply form prefill | Job page fetches `getCurrentUserProfile()` server-side and passes combined user/profile data to `JobApplyForm`, which prefills name, email, and LinkedIn. | ✅ Lecture 102 |
| Logged-in guards | `/login` and `/signup` server pages call `getCurrentUser()` and `redirect("/")` if a user exists. | ✅ Lecture 101 |
| Navbar auth state + sign out | Navbar shell stays server-side. Active links use `NavbarLinks` client component. Account area uses server `getCurrentUser()`. Sign out is isolated to `SignOutButton` client component. | ✅ Lecture 103 |
| Apply auth UX | Guests on job details see `ApplyAuthPrompt` with login/signup callback links instead of `USER PROFILE NOT FOUND`. | ✅ Lecture 104 |
| Server Action protection | `applyToJob` requires a current user; `handleCreateJob` requires an admin user before creating jobs. | ✅ Lecture 104 |
| Authorization (admin role gate) | `proxy.ts` uses `getToken()` and JWT `role` to protect admin routes; dashboard layout repeats the admin check as defense in depth. | ✅ Lecture 105 |
| Auth-only layout | Login/signup still use the regular client layout with navbar/footer. Needs a dedicated auth layout shared by public/admin auth flows. | Lecture 106 |
| Admin seeding | Not implemented. Current lesson tests admin by manually changing one user's MongoDB role to `ADMIN` and logging in again. | Future |
| Candidates persistence | `services/candidates/candidates.service.ts` still returns the static `CandidateData` array. No `CandidateModel`. Candidate identity/profile is now represented by `User` + `UserProfile`, but the admin candidates page has not migrated yet. | Day 11+ |
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

### Auth & session conventions

- **NextAuth options live in `lib/auth.ts` and contain configuration only.** No `repositories/` or `lib/password` imports — the `authorize` callback delegates to a service function.
- **Two form patterns**, picked by use case (full details in §6):
  - Server Action + `useActionState` for CRUD (`CreateJobForm`, `JobApplyForm`).
  - Plain client handler + `signIn`/`signOut` + `useRouter` for auth (`LoginForm`, `SignupForm`).
- **Reading the current user**:
  - Server: `await getCurrentUser()` from `lib/current-user.ts` — wraps `getServerSession(authOptions)` and returns the app's `User | null`.
  - Client: `useCurrentUser()` from `hooks/useCurrentUser.ts` — wraps `useSession()` and returns `User | null` for UI convenience.
  - Both helpers return the same app-level `User | null` shape (`id`, `name`, `email`, `role`) thanks to the augmentation in `types/next-auth.d.ts`.
- Server-side ownership/security decisions must use `getCurrentUser()`. Client-side helpers are only for UI state and prefill.
- **Proxy route protection uses `getToken()`**, not `getCurrentUser()`/`getServerSession()`. The proxy reads the JWT from cookies and checks `token.role`.
- **Admin protection is layered**: proxy blocks early, dashboard layout repeats the check, and admin Server Actions still check `role === "ADMIN"` before mutating data.
- **Profile data is not session data.** LinkedIn/resume/profile fields live in `UserProfile` and are fetched through repositories/services when needed. Do not put editable profile fields into the JWT/session.
- The users service may orchestrate multiple user-related repositories. Current example: `services/users/users.service.ts` calls both `getCurrentUser()` and `user-profiles.repository.ts` to return a combined current-user profile view.
- **Adding fields to the session**: extend `Session.user`, `User`, and `JWT` in `types/next-auth.d.ts` first, then write them in the `jwt` callback (sign-in only) and read them in the `session` callback (every read).
- **Never serialize `passwordHash` outside the repository's auth-only path** (`findUserByEmailWithPassword`). Services strip it before returning.

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
| 10 (in progress) | Authentication — Lectures 96–105 | **NextAuth.js v4 + JWT sessions, in progress.** Scaffolding (`lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `SessionProvider` in root layout). `UserModel`, `Role` const tuple, `users.repository.ts` (with `findUserByEmail` / `findUserByEmailWithPassword` split). `lib/password.ts` for bcryptjs. **Signup**: server-side validation + password match + uniqueness + bcrypt hash via `signup` service; Lecture 100 separately introduced the success redirect/entry behavior and cleaned it up into the current plain client handler that auto-`signIn`s on success. **Login**: `CredentialsProvider.authorize` delegates to `verifyCredentials` service; plain client handler calls `signIn("credentials", { redirect: false })`. **Types/callbacks**: `types/next-auth.d.ts` augments `Session.user`, `User`, `JWT` with `id` + `role`; callbacks write/read those fields. **Lecture 101**: `getCurrentUser()` wraps `getServerSession` for server pages/services; `useCurrentUser()` wraps `useSession` for client-only UI; `/login` and `/signup` bounce signed-in users to `/`; `applyToJob` reads `getCurrentUser().id` — no more hardcoded `candidateId`. **Lecture 102**: `UserProfileModel`, `user-profiles.repository.ts`, and `services/users/users.service.ts`; signup creates `UserProfile` with LinkedIn; job details page fetches `getCurrentUserProfile()` and passes combined identity/profile data to `JobApplyForm`, pre-filling name, email, and LinkedIn. **Lecture 103**: navbar auth state with a server `NavbarAccount`, client `NavbarLinks` for active underline styling, and client `SignOutButton` for sign-out interaction. **Lecture 104**: guest apply UX via `ApplyAuthPrompt`, auth callback returns, and Server Action protection for admin job creation. **Lecture 105**: proxy-level admin route protection with `getToken()` plus dashboard layout defense in depth. |

### Planned next

- **Day 10 remaining** — Lesson 106: Clean Layout for Auth Pages | صفحات بسيطة لتسجيل الدخول وإنشاء حساب, then RBAC and admin/candidate access-rule lessons.
- **Day 11** — Follow-up authorization hardening if not completed in the Day 10 security section: admin-role gate at the edge in `proxy.ts` using `getToken({ req, secret })`, plus defense-in-depth `session.user.role === "ADMIN"` checks inside admin server components and actions. Migrate `services/candidates/candidates.service.ts` to `findUsersByRole("CANDIDATE")` and retire `data/CandidateData.ts`.
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
- NextAuth says `[next-auth][error][NO_SECRET]` → `NEXTAUTH_SECRET` is missing from the runtime env. Required even with JWT sessions.
- `useSession` returns `undefined` forever → `app/layout.tsx` must wrap `{children}` in `<SessionProvider>` (the client wrapper from `components/providers/SessionProvider.tsx`).
- A user shows `role: undefined` in the session → JWT/session callbacks aren't propagating it; check `lib/auth.ts` callbacks and confirm `types/next-auth.d.ts` augments `User`/`JWT`/`Session.user`.
- `Property 'role' does not exist on type 'User | AdapterUser'` in `lib/auth.ts` → `types/next-auth.d.ts` is missing or the TS server hasn't reloaded. Create the file using `extends DefaultUser` / `extends DefaultJWT`, then `Cmd+Shift+P → TypeScript: Restart TS Server`.
- After login, navbar still shows LOG IN / SIGN UP until the next click → the client called `signIn` but forgot `router.refresh()`. `useSession` updates on its own, but server components on the destination need the refresh to re-render with the new cookie.
- `signIn(...)` immediately redirects to a NextAuth error page and you can't show inline errors → you forgot `redirect: false`. With that flag, `signIn` returns `{ ok, error }` so the form can render an inline message and navigate itself.
- Signup form submits but the user is "stranded" on `/signup` after success → the action returned `undefined` and no client-side navigation followed. Current Lecture 100 cleanup uses auto-login: call `signIn("credentials", { …, redirect: false })` in the same client handler, then `router.push("/") + router.refresh()`.
- `applyToJob` errors with `errors.auth = ["You must be logged in to apply"]` even though the user appears logged-in → the request reaching the server has no `next-auth.session-token` cookie. Confirm `<SessionProvider>` is mounted, the user actually signed in (cookie present in DevTools), and the request is same-origin.
- Job details page shows `UserProfileNotFound` for a signed-in user → the user likely predates Lecture 102 and has no `userprofiles` document. Create a profile for that user or sign up a fresh account after the LinkedIn field was added.
- LinkedIn does not prefill in `JobApplyForm` → do not expect it from `useSession()`. The page must call `getCurrentUserProfile()` server-side and pass the returned profile into the client form.
- Navbar active state works on `/jobs` but not `/jobs/[id]` → `NavbarLinks` is using exact pathname matching. Use `pathname.startsWith("/jobs")` for the jobs link if nested job routes should stay active.
- Navbar account cells look misaligned → do not mix the shared `Button` CTA defaults with plain navbar cells unless classes are normalized. The shared `Button` includes default padding, shadow, and hover transforms; navbar account cells need compact, consistent classes.
- User role was changed to `ADMIN` in MongoDB but proxy still redirects to `/not-authorized` → the JWT still has the old role. Log out and log in again so the `jwt` callback writes the updated role into the token.
- Proxy redirects every admin page to login → confirm `NEXTAUTH_SECRET` is set and matches the secret used by NextAuth; `getToken()` needs the same secret to verify the JWT.
