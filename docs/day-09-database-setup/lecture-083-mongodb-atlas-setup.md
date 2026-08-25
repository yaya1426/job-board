# Lecture 083 - Setting Up MongoDB Atlas | إعداد MongoDB Atlas

## Goal

Provision a cloud MongoDB cluster, create a database user, allow application access, and produce a connection string the Next.js app will use as `MONGO_URI`.

## Explain It Simply (For Beginners)

MongoDB Atlas is MongoDB's hosted service. Instead of installing MongoDB on your laptop and hoping it matches production, you create a **cloud cluster** that both local development and DigitalOcean can reach.

You need four things by the end:

1. A cluster (the database server)
2. A database user (username + password)
3. A network allowlist (so your app is permitted to connect)
4. A connection string (the address + credentials)

### Jargon decoder

- **Cluster** = the managed MongoDB server group in Atlas.
- **Connection string** = the URL your app uses, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/wazifa`.
- **Database name** = the logical DB inside the cluster. If you omit it, Mongoose may default to `test`.

## Recording Steps

1. Create or sign in to a MongoDB Atlas account.
2. Create a free/shared cluster in a region close to your app (e.g. Frankfurt if deploying in EU).
3. Create a database user with a strong password; store it in a password manager.
4. Configure network access:
   - For development: allow your current IP or `0.0.0.0/0` temporarily (teach the security trade-off).
   - For production: restrict to known egress IPs when possible; App Platform may need broader access on a small project.
5. Click **Connect → Drivers** and copy the Node.js connection string.
6. Replace `<password>` and set the database name explicitly, e.g. `/wazifa` before the query string.
7. Add to `.env.local`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/wazifa?retryWrites=true&w=majority
```

8. Explain that DigitalOcean will need the same variable at **run and build time** (preview Lecture 092 / Dockerfile).

## Common Mistakes to Call Out

- Forgetting the database name → app connects to `test` and looks empty.
- Special characters in passwords that must be URL-encoded in the connection string.
- Atlas IP allowlist blocking DigitalOcean deploys.
- Committing `.env.local` to git (never do this).

## Key Teaching Lines

> Atlas is not "extra setup." It is how small teams get production-like persistence on day one.

> The connection string is a secret. Treat it like a password.

## End State

Students have a working Atlas cluster and a local `MONGO_URI` ready for Mongoose.

## Next

Lecture 084 wires the connection into Next.js through `lib/db.ts`.
