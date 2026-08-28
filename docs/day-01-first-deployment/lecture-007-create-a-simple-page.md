# Lecture 7 - Create a Simple Page

## Goal

Replace the create-next-app starter UI with a one-screen branded page so `/` shows a real product surface before the first deploy.

## Implementation Status

**Done on Day 1**, then replaced. Today’s home page is the Day 6 landing inside `app/(client)/`.

## What We Really Did

`app/page.tsx` maps to `/`. We threw out the default Next.js marketing starter (logo grid, `next/image` template) and used a full-viewport centered heading.

**First committed page** (`7161301`):

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Job Board</h1>
      <p className="text-lg">AI Interview Assistant</p>
    </div>
  );
}
```

`import Image from "next/image"` is leftover from the starter and unused — evidence the page started as the create-next-app template.

**Lecture 7 commit** (`6c1b9eb`, message `Cahnge tilte in page.tsx`):

```diff
-      <p className="text-lg">AI Interview Assistant</p>
+      <p className="text-lg">Welcome to Production App!</p>
```

That is the page that went to production on Day 1:

- Heading: **Job Board**
- Subtitle: **Welcome to Production App!**
- Tailwind utilities only (`flex`, `h-screen`, `text-4xl`)
- No `"use client"` — Server Component by default
- No `wazifa.app` copy, no navbar, no job cards

Layout metadata stayed `title: "Job Board"` / `description: "Job Board AI Interview Assistant"`.

## Implementation steps

### 1. File-based routing

`app/page.tsx` → `/`. Nested folders become URL segments later (Day 3).

### 2. Replace the starter

Keep the layout. Change only the page. Centered heading + one line of supporting text is enough.

### 3. Confirm hot reload

With `npm run dev` running, save the file and watch the browser update.

### 4. Leave it a Server Component

No `"use client"`. Static markup does not need the client bundle.

## Today (do not teach as Day 1)

Home is `app/(client)/page.tsx`: it imports `HeroSection` / `FeaturedJobs` and calls `getJobs()`. That is Days 4 and 6, then Day 9 persistence.

## Verify

- [ ] `/` shows **Job Board** and **Welcome to Production App!** (Day 1)
- [ ] No `"use client"` on the home page
- [ ] Git shows `6c1b9eb` changing the subtitle
- [ ] Layout still wraps the page with Geist fonts and `globals.css`

## Outcome

A custom `/` route proves App Router file-based routing. That HTML is what DigitalOcean serves after Lecture 9.

## Notes / Gaps

- Product name on screen is **Job Board**, not `wazifa.app`.
- Unused `Image` import was not cleaned up on Day 1.
- Commit message typo is historical.

## Next

[Lecture 8 — Github Repo Setup](./lecture-008-github-repo-setup.md)
