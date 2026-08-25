# Lecture 081 - Day 9 Plan | خطة اليوم التاسع

## Goal

Introduce Day 9 as the shift from mock data to a real MongoDB database, with Mongoose models, a repository layer, and a persisted apply-to-job flow.

## Explain It Simply (For Beginners)

Until now, jobs and applications lived in static files or in-memory mock arrays. They reset when the server restarts. Day 9 makes the data **real and persistent**.

Think of it like moving from sticky notes on a whiteboard to a filing cabinet:

- **MongoDB** is the filing cabinet.
- **Mongoose** is the label system that keeps documents consistent.
- **Repositories** are the clerks who fetch and file papers in a format the rest of the app understands.

By the end of the day, a candidate can apply to a job and an admin can see that application in the dashboard — backed by MongoDB.

## Current State to Show

- Jobs and applications still come from mock/static sources or service functions without persistence.
- `CreateJobForm` and `JobApplyForm` exist from Day 8, but mutations do not survive a restart.
- No `lib/db.ts`, no Mongoose models, no repositories yet.
- Docker deploys without a build-time database connection strategy.

## Recording Steps

1. Open the jobs list and admin applications table; explain that data is not persisted yet.
2. Show the Day 8 service layer and note that services still need a real data source.
3. Preview the target architecture:

```txt
Server Action / Server Component
  -> Service
  -> Repository
  -> Mongoose Model
  -> MongoDB
```

4. Walk through Lectures 081–093:
   - 082–083: why MongoDB and how to provision Atlas
   - 084–087: connection, models, repositories
   - 088–089: create applications and clean test data
   - 090: aggregation for applicant counts
   - 091–092: branch workflow and Next.js caching fixes
   - 093: recap

## Key Teaching Lines

> Day 8 gave us the shape of backend code. Day 9 gives it memory.

> We are not adding a database "because courses do databases." We are adding it because mock data cannot survive production.

> The repository layer arrives after we feel the pain of leaking Mongoose documents into services.

## End State

Students understand why MongoDB fits this product, what "persisted apply flow" means, and the lecture sequence for the day.

## Next

Lecture 082 compares SQL and NoSQL so students understand why this project chose MongoDB.
