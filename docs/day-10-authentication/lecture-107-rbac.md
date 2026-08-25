# Lecture 107 - Role-Based Access Control (RBAC) | التحكم في الصلاحيات حسب الدور

## Status: **Partial** — ad-hoc role checks only; no centralized RBAC system

## Goal

Introduce the *concept* of role-based access control and document what exists today: scattered `role === "ADMIN"` checks rather than a reusable permission layer.

## Explain It Simply (For Beginners)

**RBAC** means: "This action is allowed for this role."

Today wazifa.app has two roles in `types/Roles.ts`:

- `CANDIDATE` — apply to jobs, manage own profile
- `ADMIN` — dashboard, create jobs, review applications

Enforcement is **explicit and local**:

| Location | Check |
|----------|-------|
| `proxy.ts` | `token.role !== "ADMIN"` → `/not-authorized` |
| `dashboard/layout.tsx` | `getCurrentUser().role !== "ADMIN"` |
| `handleCreateJob` | `currentUser.role === "ADMIN"` |
| `applyToJob` | any authenticated user (candidate) |

There is no:

- `can(user, "jobs:create")` helper
- permission matrix table
- role management UI
- middleware policy registry

That is intentional for the course stage — felt pain before abstraction.

## What a Full RBAC Layer Would Add (Future)

```txt
types/Permissions.ts
services/auth/authorize.ts — canAccess(user, action, resource)
```

Benefits later:

- One place to audit rules
- Easier to add `RECRUITER` or scoped admin
- Tests for permission matrix

Costs now:

- Premature for two roles and three checks
- Hides the actual security lines students need to read

## Recording Steps

1. List every `role === "ADMIN"` check in the repo.
2. Explain defense in depth: proxy + layout + action.
3. Contrast with a hypothetical `requireAdmin()` helper — nice, not required yet.
4. Discuss JWT staleness when roles change in MongoDB.
5. Mark this lecture as **partial** — concept taught, system not built.

## Key Teaching Lines

> Ad-hoc checks are honest RBAC for a two-role app. Centralize when duplication hurts.

> RBAC answers authorization. Authentication already answered who.

## End State

Students understand RBAC vocabulary and where this project enforces roles today.

## Next

Lecture 108 maps admin vs candidate access rules — also partial.
