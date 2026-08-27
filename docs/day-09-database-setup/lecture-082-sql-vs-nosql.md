# Lecture 082 - SQL vs NoSQL: What to Choose? | SQL مقابل NoSQL

## Goal
Teach the trade-off between relational and document databases so readers understand why wazifa.app uses MongoDB — without turning the lecture into a database religion debate.

## Background
A database is where your app remembers things after the server restarts.

Two common families:

1. **SQL (relational)** — data lives in tables with strict rows and columns. Tables link to each other through foreign keys. Think spreadsheets that reference each other.
2. **NoSQL (document)** — data lives in flexible JSON-like documents. One document can hold nested fields without joining many tables.

Neither is "better." They optimize for different shapes of data and different query patterns.

### Jargon decoder

- **Schema** = the rules about what fields exist and what types they have.
- **Join** = combining rows from multiple SQL tables in one query.
- **Document** = one stored record in MongoDB, usually shaped like `{ title: "...", tags: ["..."] }`.
- **Aggregation** = MongoDB's pipeline for computing derived values (like applicant counts).

## Why MongoDB Fits This Project
For wazifa.app at this stage:

| Factor | Why MongoDB works here |
|--------|------------------------|
| Document shape | Jobs have tags, requirements arrays, and long descriptions — natural as one document |
| Teaching pace | One collection per entity is easy to introduce incrementally |
| Prototype speed | Flexible fields help while the product is still evolving |
| Hosting | MongoDB Atlas has a generous free tier for course projects |

SQL would also work. PostgreSQL with JSON columns is a valid production choice. The course picks MongoDB because the document model matches the current entity shapes and keeps Day 9 focused on persistence, not migration tooling.

## When SQL Is Often Better
Teach these honestly:

- Heavy relational reporting across many normalized tables
- Strict transactional constraints across multiple entities
- Teams already standardized on Postgres + an ORM
- Complex ad-hoc joins are the main read pattern

## When Document Stores Shine
- Entity data is mostly read/written as a whole document
- Nested arrays and semi-structured fields are common
- Schema evolves quickly during early product work
- Horizontal scaling patterns matter later (not Day 9's focus)

## Implementation steps
1. Compare a normalized SQL `jobs` + `applications` schema with one MongoDB `Job` document (`tags[]`, `requirements[]`).
2. Describe the application **snapshot pattern** — one document stores submitted candidate/job fields even if live data changes later.
3. Commit to MongoDB + Mongoose for wazifa.app; no ORM migration tooling in Day 9.
4. Note that applicant counts will be **derived** with `$lookup` (Lecture 090), not stored on the job document.

## Key points
> Choose the database that matches your data shape and team workflow, not the logo on a blog post.

> We are not avoiding SQL forever. We are choosing the simplest persistent store for this job board right now.

## End State
You should be able to explain the difference between tables and documents and articulate why this project starts with MongoDB.

## Next
Lecture 083 walks through MongoDB Atlas setup (external platform work).
