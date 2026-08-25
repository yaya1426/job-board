# Lecture 084 - Connection in Next.js using Mongoose | الاتصال بقاعدة البيانات

## Goal

Install Mongoose, implement a singleton connection helper in `lib/db.ts`, and explain why Next.js dev hot-reload requires caching the connection on `globalThis`.

## Explain It Simply (For Beginners)

Every time server code needs the database, it should not open a brand-new connection. That is slow and can exhaust Atlas connection limits.

`dbConnect()` is the one function every repository calls first. It:

1. Reuses an existing connection if one exists
2. Otherwise starts `mongoose.connect(MONGO_URI)` once
3. Caches the promise and connection on `global.mongooseCache`

In development, Next.js reloads modules frequently. Without the cache, you get "too many connections" errors.

## Files

- `lib/db.ts`
- `.env.local` → `MONGO_URI`

## Implementation Shape

```ts
// lib/db.ts — pattern summary
const cached = global.mongooseCache ?? { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

Key details in the real file:

- Throws early if `MONGO_URI` is missing — fail loud in development.
- Uses `bufferCommands: false` so Mongoose does not queue commands while disconnected.
- Logs connect milestones for debugging during the lesson.

## Recording Steps

1. Install Mongoose: `npm install mongoose`.
2. Create `lib/db.ts` with the cache pattern.
3. Add `MONGO_URI` to `.env.local` from Lecture 083.
4. Temporarily call `dbConnect()` from a scratch script or route to verify Atlas connectivity.
5. Show Atlas → Browse Collections after the first write (later lectures).
6. Explain: **only repositories** should call `dbConnect()`, not components or services directly.

## Layering Rule

```txt
Service -> Repository -> dbConnect() -> MongoDB
```

Services never import `mongoose`. That rule becomes important when models leak `_id` and `Date` objects.

## Key Teaching Lines

> One connection helper, called from one layer.

> If MongoDB looks empty in production, first check whether `MONGO_URI` includes the correct database name.

## End State

The app can connect to Atlas reliably in development without connection storms during hot reload.

## Next

Lecture 085 defines the first domain model: `Job`.
