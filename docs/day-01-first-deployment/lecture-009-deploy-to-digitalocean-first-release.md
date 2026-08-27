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

## Implementation steps

### Step 1 — Enable standalone output
- Standalone output rationale: smaller Docker image—only traced dependencies are shipped.
- Inspect `next.config.ts` and confirm `output: "standalone"`:

```1:12:next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    }
  }
};

export default nextConfig;
```

- Day 1 had only `output: "standalone"`—`serverActions.bodySizeLimit` was added Day 11 for resume uploads.

### Step 2 — Review the multi-stage Dockerfile
- Inspect `Dockerfile` — each stage:
  - **deps** — install `node_modules` from lockfile.
  - **builder** — copy source, run `next build`.
  - **runner** — copy `.next/standalone` + static assets, run as non-root `nextjs` user.

```56:83:Dockerfile
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- `HOSTNAME=\"0.0.0.0\"` and `PORT=3000` for container networking.
- Note: current Dockerfile also declares build-time `ARG`/`ENV` for `MONGO_URI` and other secrets (Days 9 and 11)—Day 1 had none.

### Step 3 — Verify build locally
- Run `npm run build` and confirm `.next/standalone` is generated.
- Optionally test the standalone server locally:

```bash
node .next/standalone/server.js
```

### Step 4 — Configure DigitalOcean App Platform
- Create/configure an App Platform app:
  - Connect the GitHub repository from Lecture 8.
  - Select **Dockerfile** as the build method (not buildpack).
  - Set HTTP port to **3000**.
- Trigger first deploy; watch build logs for `next build` success.

### Step 5 — Confirm production URL
- Review the default App Platform URL (e.g. `https://<app-name>.ondigitalocean.app`) and confirm the simple page loads.
- Shipped on Day 1—not after weeks of local-only work.
- Custom domain and HTTPS come on Day 2.

## Verify
- [ ] `next.config.ts` has `output: "standalone"`.
- [ ] `Dockerfile` ends with `CMD ["node", "server.js"]` in a multi-stage build.
- [ ] `npm run build` succeeds and `.next/standalone` exists.
- [ ] App Platform build logs show a successful `next build`.
- [ ] Default App Platform URL serves the Next.js app.

## Outcome

- Next.js app deploys to DigitalOcean App Platform via Docker with standalone output.
- A real production URL serves the Day 1 page outside localhost.
- Foundation ready for custom domain connection on Day 2.

## Notes / Gaps

- Current `Dockerfile` declares build-time `ARG`/`ENV` for `MONGO_URI`, Spaces, and OpenAI keys—added when DB and Day 11 features required build-time env access.
- Day 1 deploy had no database; the app was static/simple HTML from Next.js.
- `next.config.ts` today also sets `experimental.serverActions.bodySizeLimit` for resume uploads (Day 11).
- App Platform default URL differs from `wazifa.app`; domain connection is Day 2.

## Next

[Lecture 10 — Recap Day (1)](./lecture-010-recap-day-1.md)
