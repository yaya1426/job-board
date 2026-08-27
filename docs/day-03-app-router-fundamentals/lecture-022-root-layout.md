# Lecture 22 - Root Layout (Entrypoint) | التخطيط الجذري

## Goal

Introduce `app/layout.tsx` as the single HTML entrypoint: `<html>`, `<body>`, global styles, and metadata shared by every route.

## Implementation Status

Implemented (root layout exists; SessionProvider and fonts added in later days)

## Key Files (as implemented today)

- `app/layout.tsx` — root layout with fonts, metadata, global CSS import, `SessionProvider`
- `app/globals.css` — global styles and design tokens (expanded heavily in Day 5)

## What Was Built

On Day 3, the root layout was refined with `<html lang="en">`, `<body>`, font variables, and `import "./globals.css"`. Metadata (`title`, `description`) was set at this level. Child route groups add their own layouts later without replacing the root shell.

## Implementation steps

### Step 1: Inspect `app/layout.tsx`

This file runs for **every** route in the app. It is the single place for `<html>` and `<body>`.

### Step 2: Add metadata export

```16:19:app/layout.tsx
export const metadata: Metadata = {
  title: "Job Board",
  description: "Job Board AI Interview Assistant",
};
```

Change `title` live and refresh — document title updates site-wide.

### Step 3: Wire fonts with `next/font/google`

```6:14:app/layout.tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

Apply font CSS variables on `<body>` (Day 5 later adds Space Grotesk in `globals.css`).

### Step 4: Import global styles

```3:3:app/layout.tsx
import "./globals.css";
```

One entry point for Tailwind and design tokens (expanded Day 5).

### Step 5: Render `{children}`

```21:34:app/layout.tsx
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

Day 3: wrap `{children}` directly — no navbar here (navbar arrives in `app/(client)/layout.tsx` on Day 5). `SessionProvider` is Day 10.

## Verify
- `app/layout.tsx` exports default `RootLayout` with `<html>` and `<body>`.
- `globals.css` is imported.
- Visiting `/` and `/jobs` shares the same document shell.
- `app/layout.tsx` exports a default `RootLayout` with `<html>` and `<body>`.
- `app/globals.css` is imported from the root layout.

## Outcome

Root layout is the single HTML entrypoint: metadata, fonts, `globals.css`, and `{children}` shared by every route. Surface-specific chrome arrives in nested layouts on Day 5.

## Notes / Gaps

- Day 5 replaces/extends font and token setup in `globals.css` (Space Grotesk, brutalist theme).
- `SessionProvider` is Day 10; auth is not part of this lecture.
- Admin and client surfaces share this root layout; surface-specific chrome is in nested layouts.

## Next

[Lecture 23 - Nested Routes](./lecture-023-nested-routes.md)
