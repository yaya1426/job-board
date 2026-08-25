# Lecture 6 - Create Next.js App | إنشاء تطبيق Next.js

## Goal

Create the initial Next.js 16 application with TypeScript and the App Router—the foundation every later feature will build on.

## Implementation Status

Implemented (evolved: root layout now wraps `SessionProvider` from Day 10; page later moved to `app/(client)/page.tsx` on Day 4).

## Key Files (as implemented today)

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `app/layout.tsx`
- `app/globals.css`
- `next-env.d.ts`
- `eslint.config.mjs`
- `postcss.config.mjs`

## What Was Built

- Next.js **16.1.6** project scaffolded with the App Router and TypeScript.
- Root layout (`app/layout.tsx`) with Google Geist fonts and global CSS import.
- `tsconfig.json` with strict mode, `@/*` path alias, and Next.js TypeScript plugin.
- Standard npm scripts: `dev`, `build`, `start`, `lint`.
- ESLint configured via `eslint-config-next` matching the Next.js version.
- Tailwind CSS v4 wired through PostCSS (`@tailwindcss/postcss`).

## Recording Outline

- Frame Day 1: ship something deployable before feature work.
- Run `create-next-app` (or equivalent) with TypeScript, App Router, Tailwind, ESLint.
- Walk the generated tree: `app/` is the routing root; `public/` holds static assets.
- Explain `app/layout.tsx` as the HTML shell shared by every route.
- Show `package.json` dependencies: `next@16.1.6`, `react@19.2.3`.
- Open `tsconfig.json` and explain `@/*` imports and strict typing.
- Run `npm run dev` and confirm localhost loads the starter page.
- Preview that this skeleton will be deployed today—not weeks later.
- Note React 19 + Next 16 as the course baseline; no Pages Router.

## Verify in Repo

- Open `package.json` and confirm `"next": "16.1.6"`.
- Open `app/layout.tsx` and confirm root HTML structure and `globals.css` import.
- Run `npm run dev` and load `http://localhost:3000`.

## Notes / Gaps

- Day 1 ended with a starter page at `app/page.tsx`; the home page now lives at `app/(client)/page.tsx` after Day 4 route groups.
- `app/layout.tsx` today also wraps `<SessionProvider>` (Day 10); Day 1 layout was fonts + children only.
- Many later dependencies (Mongoose, NextAuth, OpenAI, AWS SDK) were added on subsequent days—not part of Lecture 6.

## Next

[Lecture 7 — Create a Simple Page](./lecture-007-create-a-simple-page.md)
