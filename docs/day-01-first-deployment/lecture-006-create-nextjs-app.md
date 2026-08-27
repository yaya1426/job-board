# Lecture 6 - Create Next.js App (TS + App Router) | إنشاء تطبيق Next.js

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

## Implementation steps

### Step 1 — Scaffold with create-next-app
- Day 1 establishes a deployable skeleton before feature work.
- Run `create-next-app` with these options:
  - TypeScript: **Yes**
  - ESLint: **Yes**
  - Tailwind CSS: **Yes**
  - `src/` directory: **No** (course uses root-level `app/`)
  - App Router: **Yes**
  - Turbopack: default for `next dev`
- Command example:

```bash
npx create-next-app@latest job-board
```

### Step 2 — Review the generated tree
- `app/` is the App Router root; `public/` holds static assets.
- Inspect key config files: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`.
- Today’s repo also has `app/globals.css` and `next-env.d.ts` from the scaffold.

### Step 3 — Review the root layout
- Inspect `app/layout.tsx` — the HTML shell shared by every route.
- Day 1 layout was fonts + `{children}` only; today it also wraps `SessionProvider` (added Day 10):

```1:35:app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

- Day 1 layout includes only the fonts + `globals.css` import + `{children}`; `SessionProvider` is added on a later day.

### Step 4 — Review package.json and TypeScript config
- Inspect `package.json` and confirm the project baseline versions:

```11:19:package.json
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1050.0",
    "@aws-sdk/s3-request-presigner": "^3.1050.0",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.576.0",
    "mongoose": "^9.5.0",
    "next": "16.1.6",
```

- Day 1 had only `next`, `react`, and `react-dom`—later dependencies were added on subsequent days.
- Inspect `tsconfig.json` — `@/*` path alias and strict mode:

```1:24:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
```

### Step 5 — Run locally and preview deployment
- Run `npm run dev` and confirm `http://localhost:3000` loads the starter page.
- Note that this skeleton will be deployed today—not weeks later.
- Review Tailwind v4 is wired through PostCSS (`postcss.config.mjs` → `@tailwindcss/postcss`).

## Verify
- [ ] `package.json` shows `"next": "16.1.6"` and `"react": "19.2.3"`.
- [ ] `app/layout.tsx` has root HTML structure and `globals.css` import.
- [ ] `tsconfig.json` has `"strict": true` and `"@/*": ["./*"]`.
- [ ] `npm run dev` serves the starter page at `http://localhost:3000`.
- [ ] `npm run lint` passes (ESLint via `eslint-config-next`).

## Outcome

- Next.js 16 App Router + TypeScript project scaffolded with Tailwind v4, ESLint, and Geist fonts in the root layout.
- You can explain what `app/layout.tsx`, `package.json`, and `tsconfig.json` do at a Day 1 level.

## Notes / Gaps

- Day 1 ended with a starter page at `app/page.tsx`; the home page now lives at `app/(client)/page.tsx` after Day 4 route groups.
- `app/layout.tsx` today also wraps `<SessionProvider>` (Day 10); Day 1 layout was fonts + children only.
- Many later dependencies (Mongoose, NextAuth, OpenAI, AWS SDK) were added on subsequent days—not part of Lecture 6.

## Next

[Lecture 7 — Create a Simple Page](./lecture-007-create-a-simple-page.md)
