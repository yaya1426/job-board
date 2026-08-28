# Day (1) First Deployment (Ship Day)

## Goal

Get from zero to a live URL in one day: scaffold Next.js 16, put a simple page on `/`, push to GitHub, and deploy DigitalOcean App Platform with Docker.

These lecture files describe **what Day 1 actually shipped** (12 Feb 2026), not the evolved app. Where today's files differ, each lecture has a short **Today** note.

## Lecture Index

- [Lecture 6 - Create Next.js App (TS + App Router)](./lecture-006-create-nextjs-app.md)
- [Lecture 7 - Create a Simple Page](./lecture-007-create-a-simple-page.md)
- [Lecture 8 - Github Repo Setup](./lecture-008-github-repo-setup.md)
- [Lecture 9 - Deploy to DigitalOcean (First Release)](./lecture-009-deploy-to-digitalocean-first-release.md)
- [Lecture 10 - Recap Day (1)](./lecture-010-recap-day-1.md)

## What We Really Did

```txt
006  create-next-app (TS + App Router + Tailwind v4 + ESLint, no src/)
007  replace the starter UI with a centered "Job Board" page
008  git init, incremental commits, GitHub remote
009  official Next.js Dockerfile, then output: "standalone", App Platform
010  recap the zero-to-deployed loop
```

Day 1 did **not** include: custom domain, route groups, admin, database, auth, or the landing components that exist today.

## Commit Evidence (12 Feb 2026)

| Commit | Message | What it added |
|--------|---------|----------------|
| `2846932` | Add Readme.md | Default `create-next-app` README |
| `1cef65d` | Add tsconfig.json | TypeScript config (`strict`, `@/*`) |
| `c20f895` | Add .gitignore | Standard Next.js ignores, including `.env*` |
| `7161301` | Add all boilerplate files | `app/`, `package.json`, lockfile, Tailwind, ESLint, `next.config.ts` |
| `6c1b9eb` | Cahnge tilte in page.tsx | Subtitle → `Welcome to Production App!` |
| `69a7f8f` | Add Dockerfile | Official Next.js multi-stage image (`node:22-alpine`) |
| `e80545f` | Add next.js standalone | `output: "standalone"` in `next.config.ts` |

The Dockerfile commit landed **before** standalone. Standalone is required for `CMD ["node", "server.js"]` — that order is real, not a docs mistake.

## End State (end of Day 1)

- Next.js **16.1.6**, React **19.2.3**, TypeScript, App Router, Tailwind v4
- Home page at `app/page.tsx`: heading **Job Board**, subtitle **Welcome to Production App!**
- Root layout: Geist fonts, metadata title `Job Board`, `{children}` only (no SessionProvider)
- npm (`package-lock.json`); scripts `dev` / `build` / `start` / `lint`
- GitHub remote so App Platform can clone
- Multi-stage Dockerfile + `output: "standalone"`
- Live App Platform URL (default `*.ondigitalocean.app`, not `wazifa.app` yet)

## Key Files (Day 1 names)

- `app/layout.tsx`
- `app/page.tsx` (moved to `app/(client)/page.tsx` on Day 4)
- `app/globals.css`
- `package.json` / `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `Dockerfile`
- `.gitignore`

There was **no** `.dockerignore` on Day 1 (still none in the repo).

## Teaching Narrative

Ship before features. Deployment is part of day one, not a finale. The app is designed from the start to run in a container outside localhost.

## Notes

- Commit message typo `Cahnge tilte in page.tsx` is historical.
- Root `README.md` was the default create-next-app file; it was later removed. Course docs now live under `docs/`.
- Day 1 UI said **Job Board**, not the `wazifa.app` product name used in later days.
- `app/layout.tsx` gained `SessionProvider` on Day 10.
- Dockerfile later gained build-time `ARG`/`ENV` for `MONGO_URI` and other secrets (Days 9 and 11).
- `experimental.serverActions.bodySizeLimit` in `next.config.ts` is Day 11 (resume uploads).

## Day 2 handoff

Day 1 ends on the App Platform default URL. Day 2 attaches `wazifa.app` / `admin.wazifa.app` with Cloudflare DNS and HTTPS.
