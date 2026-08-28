# Lecture 10 - Recap Day (1)

## Goal

Walk the Day 1 path once: scaffold → simple page → GitHub → Docker → live URL. Name what each foundational file was for.

## Implementation Status

**Day 1 foundation is still in the repo.** Layout, home page, Dockerfile, and config all grew later; the deploy loop did not change.

## What We Really Did

| Lecture | Result |
|---------|--------|
| 6 | `create-next-app`: Next 16.1.6, React 19.2.3, App Router, Tailwind v4, ESLint, npm |
| 7 | `/` shows **Job Board** / **Welcome to Production App!** |
| 8 | GitHub remote; incremental commits; `.gitignore` blocks `.env*` |
| 9 | Official Dockerfile, then `output: "standalone"`, App Platform URL |

Intentionally **not** on Day 1: database, auth, admin, route groups, custom domain, job listings.

## Files and their Day 1 job

| File | Day 1 role |
|------|------------|
| `package.json` | `next`, `react`, `react-dom` only; `dev` / `build` / `start` / `lint` |
| `app/layout.tsx` | HTML shell, Geist fonts, metadata `Job Board`, `{children}` |
| `app/page.tsx` | `/` — centered heading (later `app/(client)/page.tsx`) |
| `app/globals.css` | Tailwind v4 `@import "tailwindcss"` |
| `tsconfig.json` | `strict`, `@/*` |
| `next.config.ts` | `output: "standalone"` after Lecture 9 |
| `Dockerfile` | multi-stage → `node server.js` on port 3000 |
| `.gitignore` | `node_modules`, `.next`, `.env*` |

## Implementation steps

### 1. Restate the arc

Create the app, put something visible on `/`, push, containerize, deploy. Tomorrow adds DNS; today’s work is not thrown away.

### 2. Match git to the story

```bash
git log --oneline --reverse | head -7
```

Expect: README → tsconfig → gitignore → boilerplate → page subtitle → Dockerfile → standalone.

### 3. Compare local and production

`http://localhost:3000` and the App Platform URL should show the same simple page.

### 4. Name what is missing on purpose

Route groups, SessionProvider, `MONGO_URI` in the Dockerfile, and the landing UI all arrive on later days.

## Verify

- [ ] You can say the path: scaffold → page → git → Docker → App Platform
- [ ] `npm run build` succeeds
- [ ] Early commits match the table in the Day 1 README
- [ ] `output: "standalone"` and `Dockerfile` exist
- [ ] Deployed URL loads

## Outcome

A Next.js 16 app runs locally and in production. Deployment is part of development. Day 2 attaches `wazifa.app` without changing this container setup.

## Next

Day 2 starts with [Lecture 11 — Day (2) Plan](../day-02-domain-dns-https/lecture-011-day-2-plan.md)
