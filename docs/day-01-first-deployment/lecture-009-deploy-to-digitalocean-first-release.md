# Lecture 9 - Deploy to DigitalOcean (First Release) | النشر على DigitalOcean

## Goal

Deploy the Next.js app to DigitalOcean App Platform using Docker and standalone output so a real URL serves the application outside localhost.

## Implementation Status

Implemented (Dockerfile later gained build-time `ARG`/`ENV` for `MONGO_URI` and other secrets on Day 9 DB work and Day 11; Day 1 Dockerfile was simpler).

## Key Files (as implemented today)

- `Dockerfile`
- `next.config.ts`
- `package.json`
- `.dockerignore` (if present)

## What Was Built

- `next.config.ts` with `output: "standalone"` for minimal production bundle (commit `e80545f`).
- Multi-stage `Dockerfile`: deps → builder → runner using `node:22-alpine` (commit `69a7f8f`).
- Runner stage copies `.next/standalone` and static assets; runs `node server.js` on port 3000.
- DigitalOcean App Platform app configured for Dockerfile-based build and deploy.
- First production URL live on App Platform (before custom domain on Day 2).

## Recording Outline

- Explain why standalone: smaller Docker image, only traced dependencies shipped.
- Open `next.config.ts` and show `output: "standalone"`.
- Walk the `Dockerfile` stages: install deps, build, copy standalone output.
- Explain `HOSTNAME=0.0.0.0` and `PORT=3000` for container networking.
- Create/configure DigitalOcean App Platform: connect GitHub repo, select Dockerfile.
- Trigger first deploy; watch build logs for `next build` success.
- Open the default App Platform URL and confirm the simple page loads.
- Celebrate: shipped on Day 1—not after weeks of local-only work.
- Note custom domain and HTTPS come on Day 2.

## Verify in Repo

- Open `next.config.ts` and confirm `output: "standalone"`.
- Open `Dockerfile` and confirm multi-stage build ending with `CMD ["node", "server.js"]`.
- Run `npm run build` locally and confirm `.next/standalone` is generated.

## Notes / Gaps

- Current `Dockerfile` declares build-time `ARG`/`ENV` for `MONGO_URI`, Spaces, and OpenAI keys—added when DB and Day 11 features required build-time env access.
- Day 1 deploy had no database; the app was static/simple HTML from Next.js.
- `next.config.ts` today also sets `experimental.serverActions.bodySizeLimit` for resume uploads (Day 11).
- App Platform default URL differs from `wazifa.app`; domain connection is Day 2.

## Next

[Lecture 10 — Recap Day 1](./lecture-010-recap-day-1.md)
