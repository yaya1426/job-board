# Lecture 7 - Create a Simple Page | إنشاء صفحة بسيطة

## Goal

Replace the generic starter with a minimal branded page—a real product surface before deployment.

## Implementation Status

Partial (original simple `app/page.tsx` evolved into the full landing at `app/(client)/page.tsx` with `HeroSection` and `FeaturedJobs` from Day 6).

## Key Files (as implemented today)

- `app/(client)/page.tsx` (evolved from Day 1 `app/page.tsx`)
- `app/layout.tsx`
- `app/globals.css`
- `components/landing/HeroSection.tsx` (Day 6)
- `components/landing/FeaturedJobs.tsx` (Day 6)

## What Was Built

- Day 1: edited `app/page.tsx` with a simple title/message (commit `6c1b9eb` — “Change title in page.tsx”).
- A visible, custom page proving the App Router maps `page.tsx` to the `/` route.
- Global styles through `app/globals.css` (Tailwind base imported at layout level).
- Foundation for later landing components; today the home page fetches jobs server-side.

## Implementation steps

### Step 1 — Understand file-based routing
- in the App Router, `app/page.tsx` maps to the `/` route.
- Day 1 edited `app/page.tsx`; today the home page lives at `app/(client)/page.tsx` after Day 4 route groups.
- Day 1 creates or edits `app/page.tsx` at the project root of `app/`.

### Step 2 — Write a minimal branded page (Day 1 version)
- Replace the starter content with a simple course-branded heading—no database, no components folder yet.
- Day 1 example for `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">wazifa.app</h1>
      <p className="mt-4 text-lg text-gray-600">
        Find your next opportunity
      </p>
    </main>
  );
}
```

- Review hot-reload: save the file and confirm the browser updates with `npm run dev`.

### Step 3 — Review Server Components default
- No `"use client"` directive needed for static content—this is a Server Component by default.
- Inspect `app/layout.tsx` wrapping all pages with fonts and global CSS:

```21:34:app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

- Day 1 layout had only `{children}` inside `<body>`—no `SessionProvider` yet.

### Step 4 — Review what the page evolved into (repo today)
- Inspect `app/(client)/page.tsx` to preview where this lecture leads—do not implement this on Day 1:

```1:19:app/(client)/page.tsx
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedJobs } from "@/components/landing/FeaturedJobs";
import { getJobs } from "@/services/jobs/jobs.service";

async function Home() {
  const result = await getJobs();
  if (!result.success) {
    return <div>Error loading jobs</div>;
  }
  const { data: jobs = [] } = result;
  return (
    <>
      <HeroSection />
      <FeaturedJobs jobs={jobs} />
    </>
  );
}

export default Home;
```

- Day 1 goal: one visible custom page, immediately verifiable in the browser.

### Step 5 — Preview first deployment
- This page will be the first thing users see on the deployed App Platform URL (Lecture 9).
- No navbar, database, or auth yet—one small visible change only.

## Verify
- [ ] Day 1: `app/page.tsx` renders custom branded content at `/`.
- [ ] `npm run dev` hot-reloads edits without restart.
- [ ] No `"use client"` on the simple home page.
- [ ] `app/layout.tsx` wraps the page with fonts and `globals.css`.
- [ ] Git history shows the title change (commit `6c1b9eb` — “Change title in page.tsx”).

## Outcome

- A minimal branded home page is visible at `/`—proving App Router file-based routing works.
- Global styles flow through `app/globals.css` imported in the root layout.
- Foundation laid for deployment in the next lectures.

## Notes / Gaps

- The simple Day 1 page was replaced by route-group architecture on Day 4 (`(client)` group) and rich landing UI on Day 6.
- Current home page calls `getJobs()` from the jobs service—far beyond Day 1 scope.
- Metadata in `app/layout.tsx` still reads `"Job Board"`; SEO work is Day 13.

## Next

[Lecture 8 — GitHub Repo Setup](./lecture-008-github-repo-setup.md)
