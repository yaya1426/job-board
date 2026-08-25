# Day 13 - SEO and Metadata

## Goal

Make the public job board discoverable and shareable by adding proper metadata, Open Graph tags, canonical URLs, sitemap/robots files, and job-specific structured data.

## Planning Status

**Planned — not in codebase.** No `generateMetadata` on job details, no `app/robots.ts` / `app/sitemap.ts`, no JobPosting JSON-LD, no Open Graph per job.

## Lecture Index (139–146)

- [Lecture 139 - Why SEO Matters for a Job Board](./lecture-139-why-seo-matters-for-a-job-board.md)
- [Lecture 140 - Static Metadata for Core Pages](./lecture-140-static-metadata-for-core-pages.md)
- [Lecture 141 - Dynamic Metadata for Job Details](./lecture-141-dynamic-metadata-for-job-details.md)
- [Lecture 142 - Open Graph and Social Sharing](./lecture-142-open-graph-and-social-sharing.md)
- [Lecture 143 - Canonical URLs and Domain Strategy](./lecture-143-canonical-urls-and-domain-strategy.md)
- [Lecture 144 - Robots and Sitemap](./lecture-144-robots-and-sitemap.md)
- [Lecture 145 - JobPosting Structured Data](./lecture-145-jobposting-structured-data.md)
- [Lecture 146 - Metadata QA Checklist](./lecture-146-metadata-qa-checklist.md)

## Course Position

After search, filters, and pagination are in place, public job pages are stable enough to optimize for discovery. Day 13 should focus on the public surface, not admin pages.

The current pain to show first:

- The app has generic metadata.
- Job detail pages likely share the same title/description.
- Shared links do not have job-specific previews.
- Search engines do not receive structured job posting data.

## Proposed Lessons

### Lesson 1 - Why SEO Matters for a Job Board

Start with the product problem:

- Candidates discover jobs through search and shared links.
- A job detail page should have a useful title and preview.
- Search engines need clear metadata and crawl paths.

Teaching point:

> A job page is not only a React page; it is also a document that search engines and social platforms read.

### Lesson 2 - Static Metadata for Core Pages

Add static metadata to:

```txt
app/(client)/page.tsx
app/(client)/jobs/page.tsx
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
```

Examples:

- Home title and description.
- Jobs listing title and description.
- No-index auth pages if appropriate.

Teaching point:

> Not every page should be indexed. Public content and utility pages have different SEO goals.

### Lesson 3 - Dynamic Metadata for Job Details

Use `generateMetadata` on:

```txt
app/(client)/jobs/[id]/page.tsx
```

Metadata should include:

- job title
- company
- location
- short description
- canonical URL
- Open Graph title/description

Teaching point:

> Server Components can fetch the same domain data for page rendering and metadata generation.

### Lesson 4 - Open Graph and Social Sharing

Add share-friendly metadata:

- `openGraph.title`
- `openGraph.description`
- `openGraph.url`
- optional default image
- `twitter.card`

Potential future file:

```txt
app/opengraph-image.tsx
```

Teaching point:

> Social previews are part of user experience, even though users do not see the code.

### Lesson 5 - Canonical URLs and Domain Strategy

Because the app has public/admin subdomains, define canonical URLs carefully.

Rules:

- Public job pages should canonicalize to the public domain.
- Admin pages should not be indexed.
- Auth pages should likely not be indexed.

Teaching point:

> Multiple domains make canonical URLs important; search engines need to know which URL is the real public version.

### Lesson 6 - Robots and Sitemap

Add:

```txt
app/robots.ts
app/sitemap.ts
```

Sitemap should include:

- home
- public jobs listing
- job detail pages

Robots should avoid:

- dashboard routes
- auth routes if desired
- API routes

Teaching point:

> Sitemap says what should be found. Robots says what should stay out.

### Lesson 7 - JobPosting Structured Data

Add JSON-LD to job detail pages using the `JobPosting` schema.

Fields to consider:

- `title`
- `description`
- `datePosted`
- `employmentType`
- `hiringOrganization`
- `jobLocation`
- `baseSalary` if structured enough

Teaching point:

> Job boards have a real schema type. Use it so search engines understand that this page is a job posting.

### Lesson 8 - Metadata QA Checklist

Teach verification:

- View page source.
- Inspect generated metadata.
- Test shared links.
- Use rich results testing tools.
- Confirm admin/auth pages are not indexed.

Teaching point:

> SEO work should be verified from the rendered document, not assumed from code.

## Expected End State

- Core public pages have meaningful metadata.
- Job details generate dynamic metadata.
- Public URLs have canonical values.
- Sitemap and robots are generated.
- Job pages include JobPosting structured data.
- Admin/auth pages are protected from accidental indexing.

## Open Decisions

- Production domain for canonical URLs.
- Whether staging domains should be no-indexed.
- Whether auth pages should be no-index.
- Whether to generate dynamic OG images in this day or later.

## Production Notes

- Do not index staging domains.
- Do not index admin pages.
- Avoid exposing sensitive data in metadata.
- Keep structured data consistent with visible page content.
- Use environment variables for canonical base URLs where needed.
