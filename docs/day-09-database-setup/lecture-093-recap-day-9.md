# Lecture 093 - Recap Day 9 | ملخص اليوم التاسع

## Goal

Consolidate Day 9: persisted jobs and applications, repository layering, snapshot applications, derived applicant counts, and Next.js deployment fixes.

## Day 9 Milestone Checklist

Verify live on staging:

- [ ] Atlas cluster connected via `lib/db.ts`
- [ ] Jobs CRUD reads/writes MongoDB through `jobs.repository.ts`
- [ ] Applications persist with snapshot fields
- [ ] Apply form → Server Action → service → repository → MongoDB
- [ ] Admin applications table shows real rows
- [ ] Job applicant counts come from aggregation, not stored fields
- [ ] Layouts export `force-dynamic` + `revalidate = 0`
- [ ] Mutations call `revalidatePath(..., "layout")`
- [ ] Docker build receives `MONGO_URI` at build time

## Architecture Recap

```txt
Action / Server Component
  -> Service (zod validation, business rules)
  -> Repository (mapper, dbConnect, Mongoose)
  -> MongoDB
```

## Concepts Students Should Retain

| Concept | One-line summary |
|---------|------------------|
| Repository layer | Stops `_id`, `Date`, and Mongoose leaks |
| Snapshot pattern | Application stores what was submitted at apply time |
| Aggregation | `$lookup` + `$size` for applicant counts |
| `force-dynamic` | DB pages must not static-prerender at build |
| `MONGO_URI` | Secret connection string; include database name |

## Intentionally Incomplete (By Design)

- Candidate id is still temporary — **Day 10** adds authentication
- Resume upload is placeholder — **Day 11**
- Duplicate apply check — future enhancement
- Active job check — future enhancement

## Recording Steps

1. Demo the full flow: create job → apply → see in admin → restart server → data still there.
2. Open Atlas and point at `jobs` and `applications` collections.
3. Show one mapper function and explain why it exists.
4. Show layout `force-dynamic` exports.
5. Preview Day 10: real users, passwords, sessions, and `candidateId` from auth.

## Key Teaching Lines

> Day 9 gave the app memory. Day 10 will give it identity.

> If production data looks empty, check `MONGO_URI`, database name, and `force-dynamic` — in that order.

## End State

Students can explain the full Day 9 stack and are ready for authentication on Day 10.

## Next

Day 10 Lecture 096 installs NextAuth.js.
