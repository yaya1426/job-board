# Lecture 22 - Root Layout (Entrypoint) | التخطيط الجذري

## Goal

Introduce `app/layout.tsx` as the single HTML entrypoint: `<html>`, `<body>`, global styles, and metadata shared by every route.

## Implementation Status

Implemented (root layout exists; SessionProvider and fonts added in later days)

## Key Files (as implemented today)

- `app/layout.tsx` — root layout with fonts, metadata, global CSS import, `SessionProvider`
- `app/globals.css` — global styles and design tokens (expanded heavily in Day 5)

## What Was Built

On Day 3, students created or refined the root layout with `<html lang="en">`, `<body>`, font variables, and `import "./globals.css"`. Metadata (`title`, `description`) was set at this level. Child route groups add their own layouts later without replacing the root shell.

## Recording Outline

- Open `app/layout.tsx` and explain it runs for **every** route.
- Point out required root elements: `<html>` and `<body>` (App Router enforces this once at root).
- Show `metadata` export for default site title/description.
- Show Google font setup (`Geist`, `Geist_Mono`) via `next/font/google`.
- Explain `import "./globals.css"` — one global stylesheet entry.
- Clarify what does **not** belong here: per-surface navbars (those go in route-group layouts on Day 5).
- Note `{children}` as the slot where nested layouts and pages render.
- Mention `SessionProvider` wrapper as a later auth addition — Day 3 layout was simpler.
- Live edit exercise (optional): change `metadata.title` and refresh to see document title update.
- Transition to nested routes under `app/`.

## Verify in Repo

- `app/layout.tsx` exports a default `RootLayout` with `<html>` and `<body>`.
- `app/globals.css` is imported from the root layout.
- Visiting `/` and `/jobs` shares the same document shell.

## Notes / Gaps

- Day 5 replaces/extends font and token setup in `globals.css` (Space Grotesk, brutalist theme).
- `SessionProvider` is Day 10; do not teach auth in this lecture.
- Admin and client surfaces share this root layout; surface-specific chrome is in nested layouts.

## Next

[Lecture 23 - Nested Routes](./lecture-023-nested-routes.md)
