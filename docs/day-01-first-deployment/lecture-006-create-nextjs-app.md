# Lecture 6 - Create Next.js App (TS + App Router)

## Goal

Scaffold the Next.js 16 App Router project that every later day builds on.

## Implementation Status

**Done on Day 1.** The scaffold is still the same app; later days added providers, route groups, and dependencies around it.

## What We Really Did

Ran `create-next-app` into this repo (`job-board`), with:

- TypeScript: yes
- ESLint: yes
- Tailwind CSS: yes (v4 via PostCSS)
- `src/` directory: **no** — `app/` at the project root
- App Router: yes
- Package manager: **npm** (`package-lock.json`)

Files were committed in pieces the same day, not as one “initial scaffold” commit:

1. Default create-next-app `README.md` (`2846932`)
2. `tsconfig.json` (`1cef65d`)
3. `.gitignore` (`c20f895`)
4. Remaining boilerplate: `app/`, `package.json`, lockfile, ESLint, PostCSS, `next.config.ts`, `public/` (`7161301`)

`next.config.ts` on this lecture was still empty (`/* config options here */`). Standalone output is Lecture 9.

## Key Files (Day 1)

- `package.json` — `next@16.1.6`, `react@19.2.3`, `react-dom@19.2.3`
- `package-lock.json`
- `tsconfig.json` — `strict: true`, `"@/*": ["./*"]`
- `next.config.ts` — empty config object
- `app/layout.tsx` — Geist fonts, `{children}`, metadata title `Job Board`
- `app/globals.css` — `@import "tailwindcss"`
- `eslint.config.mjs`, `postcss.config.mjs`
- `public/` starter SVGs and `app/favicon.ico`

## Day 1 `package.json`

```json
{
  "name": "job-board",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

Next 16’s `next dev` uses Turbopack by default — no extra flag in the script.

## Day 1 `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Board",
  description: "Job Board AI Interview Assistant",
};

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
        {children}
      </body>
    </html>
  );
}
```

Metadata was already customized in this commit (not the default “Create Next App” title).

## Implementation steps

### 1. Scaffold

```bash
npx create-next-app@latest job-board
```

Choose TypeScript, ESLint, Tailwind, **no** `src/`, App Router. Use npm.

### 2. Confirm the tree

- `app/` is the App Router root (`layout.tsx`, `page.tsx`, `globals.css`).
- `public/` is static assets.
- Config: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`.

### 3. Read the root layout

`app/layout.tsx` is the HTML shell for every route. Day 1: fonts + `globals.css` + `{children}` only.

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`. This skeleton is what gets deployed the same day.

## Today (do not teach as Day 1)

- `app/layout.tsx` wraps `<SessionProvider>` (Day 10).
- Home route lives at `app/(client)/page.tsx` (Day 4).
- `package.json` later gained Mongoose, NextAuth, OpenAI, AWS SDK, Zod, shadcn, and others.

## Verify

- [ ] `"next": "16.1.6"` and `"react": "19.2.3"`
- [ ] No `src/` folder; routes live under `app/`
- [ ] `tsconfig.json` has `"strict": true` and `"@/*": ["./*"]`
- [ ] `npm run dev` serves `http://localhost:3000`
- [ ] Day 1 dependencies are only `next`, `react`, `react-dom` (plus Tailwind/ESLint/TS as devDeps)

## Outcome

A Next.js 16 App Router + TypeScript app exists on disk, runs locally, and is ready to customize and deploy.

## Next

[Lecture 7 — Create a Simple Page](./lecture-007-create-a-simple-page.md)
