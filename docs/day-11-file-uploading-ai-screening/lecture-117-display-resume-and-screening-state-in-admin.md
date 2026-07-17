# Lecture 117 - Display Resume and Screening State in Admin | عرض السيرة وحالة التقييم في لوحة الإدارة

## Goal

Let authorized admins open a private resume and understand whether screening is pending, processing, completed, or failed.

## Explain It Simply (For Beginners)

The resume is private, so there's no plain link an admin can click. Instead, when an admin clicks **Open Resume**, our server checks "are you really an admin?" and only then mints a fresh, short-lived download link and sends them to it.

Think of a hotel key card: the front desk (our server) checks who you are, then programs a card that opens *one* room for a *limited* time. It doesn't hand you the master key, and old cards stop working. That's why we generate a **new** signed link every time instead of saving one in the database — a saved link would eventually expire and break.

The most important security lesson here: **hiding a button is not security.** Even though the admin dashboard is already protected, the resume route needs its *own* admin check. A route handler is a separate door into the app — someone could call it directly without ever loading the dashboard page. Every door needs its own lock.

For the status, we translate the internal words into friendlier labels (`PENDING` → "Waiting", `COMPLETED` → "Ready") and, again, never show an absent score as `0`.

### Jargon decoder

- **Route handler** = a small server endpoint (like `/api/.../resume`) that responds to a request. It's a separate entry point from your pages.
- **Signed GET URL** = a temporary link that grants permission to *download* one specific file for a few minutes.
- **`rel="noopener noreferrer"`** = a safety attribute on links that open new tabs, so the new page can't tamper with the original.
- **Legacy record** = old data created before these fields existed (e.g., applications with no resume). The UI must not crash on them.

## Files Created/Updated

```txt
app/api/applications/[id]/resume/route.ts
components/applications/*
app/(admin)/dashboard/applications/page.tsx
```

## Step 1 - Add the Download-URL Helper (Deferred from Lecture 113)

Now that something finally needs to *read* a private file, add the signed-download helper to the upload service. We left it out of Lecture 113 on purpose — you only build a tool when a lesson needs it.

```ts
// services/uploads/uploads.service.ts (add alongside uploadResume)
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SIGNED_URL_TTL_SECONDS = 5 * 60;

export async function createResumeDownloadUrl(key: string) {
  return getSignedUrl(
    spacesClient,
    new GetObjectCommand({ Bucket: spacesBucket, Key: key }),
    { expiresIn: SIGNED_URL_TTL_SECONDS },
  );
}
```

## Step 2 - Protect Resume Access

Create an admin-only route that:

1. Calls `getCurrentUser()`.
2. Requires `role === "ADMIN"`.
3. Loads the application by id.
4. Creates a short-lived signed GET URL with `createResumeDownloadUrl(candidateResumeKey)`.
5. Redirects to that URL or returns it as JSON.

Do not render a permanent public resume URL.

## Step 3 - Add Resume UI

Add an `OPEN RESUME` action to the application row/details UI.

- Open in a new tab.
- Use `rel="noopener noreferrer"` if using a link.
- Show a missing-resume state for legacy records.

## Step 4 - Add Screening Status Badge

Map internal values to display labels:

```txt
PENDING    -> Waiting
PROCESSING -> Screening
COMPLETED  -> Ready
FAILED     -> Failed
```

Do not display an absent `aiScore` as `0`.

## Step 5 - Preserve Authorization Layers

The dashboard proxy/layout protects page access, but the resume route must still check admin role because route handlers are separate security boundaries.

## Step 6 - Handle Expiration

Signed download URLs expire. Generate a fresh URL each time the admin opens the resume rather than storing the signed URL in MongoDB.

## Verification

- Guest/candidate cannot obtain a resume URL.
- Admin can open a resume.
- Signed URL expires.
- Legacy application shows a useful missing-resume state.
- Pending application shows status without a fake score.

## Key Teaching Lines

> The object key is durable; the signed download URL is temporary.

> Hiding a button is UX. Checking admin role in the route is security.

## Next

Lecture 118 reads the private PDF and extracts plain text for screening.
