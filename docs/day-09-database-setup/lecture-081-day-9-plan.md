# Lecture 081 - Day (9) Plan | خطة اليوم التاسع

## Goal
Introduce Day 9 as the shift from mock data to a real MongoDB database, with Mongoose models, a repository layer, and a persisted apply-to-job flow.

## Background
Until now, jobs and applications lived in static files or in-memory mock arrays. They reset when the server restarts. Day 9 makes the data **real and persistent**.

Think of it like moving from sticky notes on a whiteboard to a filing cabinet:

- **MongoDB** is the filing cabinet.
- **Mongoose** is the label system that keeps documents consistent.
- **Repositories** are the clerks who fetch and file papers in a format the rest of the app understands.

By the end of the day, a candidate can apply to a job and an admin can see that application in the dashboard — backed by MongoDB.

## Starting point
- Jobs and applications still come from mock/static sources or service functions without persistence.
- `CreateJobForm` and `JobApplyForm` exist from Day 8, but mutations do not survive a restart.
- No `lib/db.ts`, no Mongoose models, no repositories yet.
- Docker deploys without a build-time database connection strategy.

## Implementation steps
1. Confirm Day 8 services/actions exist (`jobs.service.ts`, `applications.service.ts`, `handleCreateJob`, `handleApplyToJob`) but still read/write mocks.
2. Plan the target stack: `lib/db.ts` singleton → `lib/models/*.model.ts` → `repositories/*.repository.ts` with `toEntity` mappers → services unchanged at the boundary.
3. Work through lectures in order: Atlas (`MONGO_URI`) → connection → Job model → jobs repository → Application model/repository → `applyToJob` persistence → aggregation → `force-dynamic` + Dockerfile `ARG MONGO_URI`.
4. Keep `candidateId` as a temporary placeholder in Day 9; Day 10 replaces it with `getCurrentUser().id`.
5. After each mutation, call `revalidatePath(..., "layout")` from the Server Action.

## Key points
> Day 8 gave us the shape of backend code. Day 9 gives it memory.

> We are not adding a database "because courses do databases." We are adding it because mock data cannot survive production.

> The repository layer arrives after we feel the pain of leaking Mongoose documents into services.

## End State
Summarizes why MongoDB fits this product, what "persisted apply flow" means, and the lecture sequence for the day.

## Next
Lecture 082 compares SQL and NoSQL so readers understand why this project chose MongoDB.
