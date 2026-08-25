# Day 12 - Search, Filters, and Pagination

## Goal

Make public and admin lists scale beyond tiny demo data by adding URL-based search, filters, sorting, and pagination.

## Planning Status

**Planned — not in codebase.** No URL pagination, no query schemas, no `PaginatedResult<T>`. Candidates still come from mock data (`services/candidates/candidates.service.ts` → `data/CandidateData.ts`).

## Lecture Index (126–138)

- [Lecture 126 - Day (12) Plan](./lecture-126-day-12-plan.md)
- [Lecture 127 - Query Params, Validation, and Pagination Model](./lecture-127-query-params-validation-and-pagination-model.md)
- [Lecture 128 - Paginating Jobs in the Repository](./lecture-128-paginating-jobs-in-the-repository.md)
- [Lecture 129 - Public Jobs Search UI](./lecture-129-public-jobs-search-ui.md)
- [Lecture 130 - Admin Applications Filtering and Pagination](./lecture-130-admin-applications-filtering-and-pagination.md)
- [Lecture 131 - Admin Applications Filter UI](./lecture-131-admin-applications-filter-ui.md)
- [Lecture 132 - Replacing Mock Candidates With Users](./lecture-132-replacing-mock-candidates-with-users.md)
- [Lecture 133 - Admin Users Search and Pagination](./lecture-133-admin-users-search-and-pagination.md)
- [Lecture 134 - Sorting and Default Ordering](./lecture-134-sorting-and-default-ordering.md)
- [Lecture 135 - Empty States and Reset Filters](./lecture-135-empty-states-and-reset-filters.md)
- [Lecture 136 - MongoDB Indexes for Search and Filters](./lecture-136-mongodb-indexes-for-search-and-filters.md)
- [Lecture 137 - Feature Branch for Day (12)](./lecture-137-feature-branch-for-day-12.md)
- [Lecture 138 - Recap Day (12)](./lecture-138-recap-day-12.md)

## Course Position

After Day 11, the app can have more realistic applications with resume uploads and screening data. Day 12 should make the listing pages usable when data grows.

The current pain to show first:

- Jobs, applications, and users are loaded as full lists.
- Admin pages will become hard to use as data grows.
- Filters are mostly client-side or static UI patterns.
- URLs do not preserve list state.

## Proposed Lessons

### Lecture 126 - Day (12) Plan

Introduce the day as the move from "load everything" to query-driven lists across both the public app and admin dashboard.

Show the problem as part of the plan:

```txt
getJobs()
  -> loads all jobs

getApplications()
  -> loads all applications

getCandidates()
  -> still returns static mock data
```

Explain:

- Slow pages.
- Large Mongo queries.
- No shareable filter URLs.
- No stable browser back/forward behavior.
- Admin pages become noisy when applications and users grow.
- The database should return only the slice the page needs.

Teaching point:

> Day 12 is about moving from "load all data" to query-driven lists.

### Lecture 127 - Query Params, Validation, and Pagination Model

Introduce the full model for query-driven lists: the URL stores the list state, schemas validate it, and services receive a clean query object.

Examples:

```txt
/jobs?query=react&type=FULL-TIME&page=2
/dashboard/applications?status=INTERVIEW&jobId=...&page=1
```

Explain why URL state matters:

- shareable URLs
- refresh keeps state
- browser back/forward works
- server pages can fetch the right slice directly

Then add shared pagination types and zod schemas next to each service:

```txt
types/Pagination.ts
services/jobs/jobs.query.ts
services/applications/applications.query.ts
services/users/users.query.ts
```

Introduce a paginated return shape:

```ts
type PaginatedResult<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
```

Example query concerns:

- `query`
- `status`
- `type`
- `location`
- `page`
- `limit`
- `sort`

Teaching point:

> The URL is the source of truth for list state, but schemas decide what values the server actually trusts.

### Lecture 128 - Paginating Jobs in the Repository

Start with the public jobs list because it is the simplest and most visible list. Update the jobs repository/service to support query filters and pagination.

Repository concepts:

- `skip`
- `limit`
- `sort`
- filtered Mongo queries
- `countDocuments`

Likely files:

```txt
repositories/jobs.repository.ts
services/jobs/jobs.service.ts
services/jobs/jobs.query.ts
```

Teaching point:

> Pagination must happen in MongoDB, not after loading all jobs into memory.

### Lecture 129 - Public Jobs Search UI

Update the public jobs page:

- Search by title/company.
- Filter by type.
- Filter by location if useful.
- Paginate.
- Preserve state in URL.

Likely files:

```txt
app/(client)/jobs/page.tsx
components/jobs/JobsFilters.tsx
components/jobs/JobsPagination.tsx
repositories/jobs.repository.ts
services/jobs/jobs.service.ts
```

Teaching point:

> Public search should be shareable. A filtered jobs URL should be copy/paste friendly.

### Lecture 130 - Admin Applications Filtering and Pagination

Start by designing the admin applications query, then implement repository/service/page support for it.

Potential filters:

- filter by application status
- filter by job
- filter by screening status from Day 11
- search candidate name/email
- optional AI score range
- page and limit
- sort

Likely files:

```txt
services/applications/applications.query.ts
repositories/applications.repository.ts
services/applications/applications.service.ts
app/(admin)/dashboard/applications/page.tsx
```

Support:

- filter by application status
- filter by job
- filter by screening status
- paginate results

Teaching point:

> Public filters help candidates discover jobs. Admin filters help teams operate, so the admin page should ask MongoDB for exactly the slice it needs.

### Lecture 131 - Admin Applications Filter UI

Build the admin filter controls.

Likely files:

```txt
components/applications/ApplicationsFilters.tsx
components/common/PaginationControls.tsx
```

Controls:

- status select
- job select
- screening status select
- candidate search
- reset filters

Teaching point:

> Filters are only useful if users can see and reset them clearly.

### Lecture 132 - Replacing Mock Candidates With Users

This is a good place to retire:

```txt
services/candidates/candidates.service.ts
data/CandidateData.ts
```

Use:

```txt
users.repository.ts
findUsersByRole("CANDIDATE")
```

Then add candidate/user pagination.

Teaching point:

> Once auth exists, candidate identity should come from users, not old mock data.

### Lecture 133 - Admin Users Search and Pagination

Update admin users/candidates page with the same query-driven list pattern.

Likely files:

```txt
app/(admin)/dashboard/users/page.tsx
services/users/users.query.ts
services/users/users.service.ts
repositories/users.repository.ts
components/users/UsersFilters.tsx
```

Support:

- search by name/email
- optional role filter
- page and limit
- paginated repository result

Teaching point:

> Admin user management needs the same list patterns as jobs and applications.

### Lecture 134 - Sorting and Default Ordering

Add stable default ordering and optional explicit sort choices.

Default examples:

```txt
jobs
  -> newest first

applications
  -> newest first, or pending screening first if useful

users
  -> newest first
```

Teaching point:

> Pagination without stable sorting creates confusing results.

### Lecture 135 - Empty States and Reset Filters

Handle no-result states across public and admin lists:

- no jobs match filters
- no applications match filters
- no users match filters
- reset filters link/button

Teaching point:

> "No results" is not an error. It is a state.

### Lecture 136 - MongoDB Indexes for Search and Filters

Add indexes based on the queries introduced throughout the day.

Examples:

```txt
jobs: title, company, type, location, posted
applications: status, jobId, candidateId, screeningStatus, appliedDate
users: email, name, role
```

Teaching point:

> Filters are only production-ready when the database can answer them efficiently.

### Lecture 137 - Feature Branch for Day (12)

Create the Day 12 branch, validate the feature, open the PR, and merge into the development flow.

Teaching point:

> A production feature is not done until it is reviewed, merged, and tested in the deployment workflow.

### Lecture 138 - Recap Day (12)

Recap:

- URL search params
- query schemas
- pagination type
- repository pagination
- public job filters
- admin application filters
- users/candidates migration
- sorting and empty states
- MongoDB indexes

Teaching point:

> Day 12 makes lists production-ready by moving state into the URL and data slicing into the database.

## Shared UI Note

Create shared pagination UI when the second paginated surface appears:

```txt
components/common/PaginationControls.tsx
```

It should:

- Preserve existing search params.
- Disable previous/next at boundaries.
- Link to `page + 1` / `page - 1`.

Teaching point:

> Pagination links should update the URL, not hidden client state.

## Expected End State

- Public jobs page supports URL-based search/filter/pagination.
- Admin applications page supports operational filters and pagination.
- Admin users/candidates page no longer depends on static candidate data.
- Repositories expose focused query methods instead of only "find all".
- Shared pagination UI exists.

## Open Decisions

- Default page size for public jobs.
- Default page size for admin tables.
- Which filters are worth teaching first.
- Whether sorting is included in Day 12 or saved for performance polish.

## Production Notes

- Add Mongo indexes for common filters/search fields.
- Avoid regex over large collections without indexes.
- Keep query parsing in services or query schema helpers, not UI components.
- Preserve unknown query params carefully or intentionally drop them.
- Test empty results as a first-class UI state.
