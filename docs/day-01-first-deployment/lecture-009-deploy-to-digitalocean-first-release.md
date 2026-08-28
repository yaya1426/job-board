# Lecture 9 - Deploy to DigitalOcean (First Release)

## Goal

Serve the Day 1 page on a real URL using DigitalOcean App Platform, a Docker image, and Next.js standalone output.

## Implementation Status

**Done on Day 1.** Same deploy path is still used. The Dockerfile and `next.config.ts` later grew extra env and upload settings.

## What We Really Did

Two commits, in this order:

1. **`69a7f8f` Add Dockerfile** — official Next.js multi-stage example (`node:22-alpine`, deps → builder → runner, `CMD ["node", "server.js"]`).
2. **`e80545f` Add next.js standalone** — `output: "standalone"` in `next.config.ts`.

Standalone was added **after** the Dockerfile. The image copies `.next/standalone` and runs `server.js`; without `output: "standalone"`, that file is not produced. The second commit is the fix that makes the first commit work.

Day 1 `next.config.ts` after the fix:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

Day 1 Dockerfile had **no** `ARG`/`ENV` for `MONGO_URI` or API keys. Builder stage was: copy `node_modules`, copy source, `npm run build`.

Runner stage (unchanged in spirit today):

- non-root user `nextjs`
- copy `public`, `.next/standalone`, `.next/static`
- `PORT=3000`, `HOSTNAME=0.0.0.0`
- `CMD ["node", "server.js"]`

App Platform:

- Connect the GitHub repo from Lecture 8
- **Dockerfile** build (not a Node buildpack)
- HTTP port **3000**
- First live URL is the App Platform default (`https://<app>.ondigitalocean.app`), **not** `wazifa.app`

No `.dockerignore` was added.

## Implementation steps

### 1. Enable standalone output

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

This traces only the files the server needs so the runner image stays small.

### 2. Add the official Next.js Dockerfile

Use the Next.js Docker example: `node:22-alpine`, three stages, lockfile-aware install (`npm ci` because this repo has `package-lock.json`).

### 3. Build locally

```bash
npm run build
```

Confirm `.next/standalone` exists. Optionally:

```bash
node .next/standalone/server.js
```

### 4. Create the App Platform app

- GitHub source from Lecture 8
- Dockerfile build method
- Port 3000
- Watch logs for a successful `next build`

### 5. Open the default URL

The centered **Job Board / Welcome to Production App!** page should load over HTTPS on `*.ondigitalocean.app`. Custom domain is Day 2.

## Today (do not teach as Day 1)

- `next.config.ts` also sets `experimental.serverActions.bodySizeLimit: "6mb"` (Day 11 resume uploads).
- Dockerfile builder declares `ARG`/`ENV` for `MONGO_URI`, Spaces, and OpenAI (Days 9 and 11) because App Platform does not inject runtime env into `docker build` unless you pass build args.

## Verify

- [ ] `output: "standalone"` in `next.config.ts`
- [ ] Dockerfile ends with `CMD ["node", "server.js"]`
- [ ] `npm run build` produces `.next/standalone`
- [ ] App Platform build succeeds
- [ ] Default App Platform URL serves the Day 1 page

## Outcome

The app runs outside localhost. Domain, DNS, and Cloudflare come next — the container path does not change.

## Next

[Lecture 10 — Recap Day (1)](./lecture-010-recap-day-1.md)
