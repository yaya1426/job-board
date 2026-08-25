# Lecture 19 - Day 3 Plan | خطة اليوم الثالث

## Goal

Preview Day 3 as the first routing-focused day: introduce the Next.js App Router mental model and ship a small but real job-board route skeleton.

## Implementation Status

Planned (this lecture is the day opener; routing work lands in Lectures 20–28)

## Key Files (as implemented today)

- `app/layout.tsx` — root HTML shell (fonts, globals, providers added in later days)
- `app/(client)/page.tsx` — home route (evolved beyond Day 3; originally `app/page.tsx`)
- `app/(client)/jobs/page.tsx` — jobs listing (evolved; originally `app/jobs/page.tsx`)
- `app/(client)/jobs/[id]/page.tsx` — dynamic job details (evolved; originally `app/jobs/[id]/page.tsx`)

## What Was Built

Day 3 does not add code in this lecture. It frames the day's outcome: three public routes (`/`, `/jobs`, `/jobs/[id]`) built with file-system routing instead of abstract demo pages.

## Recording Outline

- Welcome students to Day 3 and name the theme: **App Router fundamentals**.
- Contrast "tutorial pages" with a product-shaped routing skeleton for `wazifa.app`.
- Preview the three routes students will own by end of day: home, jobs list, job details.
- Introduce the file-system router rule: folders map to URL segments; `page.tsx` makes a route public.
- Show the repo at a high level (`app/`) without diving into every file yet.
- Name the Day 3 milestone commit: `1a56240` — core routes for jobs.
- Explain that routes were originally at `app/jobs/...` and later moved into `app/(client)/...` when route groups arrived in Day 4.
- Set expectations: concepts introduced today remain valid even when folder names change.
- Preview Lectures 20–29 in order.
- End with the first concept lecture: App Router mental model.

## Verify in Repo

- Confirm `docs/day-03-app-router-fundamentals/README.md` lists Lectures 19–29.
- Skim `app/(client)/` to see the current equivalent of Day 3 routes.
- Optional history check: `git show 1a56240 --stat` for the original Day 3 file paths.

## Notes / Gaps

- The home and jobs pages now fetch real data from services; Day 3 used simpler placeholder UI.
- Route groups `(client)` did not exist on Day 3 — mention that move when students compare old commits.
- No `layout.tsx` in the client group on Day 3; that arrives in Day 5.

## Next

[Lecture 20 - App Router Mental Model](./lecture-020-app-router-mental-model.md)
