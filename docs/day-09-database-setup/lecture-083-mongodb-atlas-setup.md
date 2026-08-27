# Lecture 083 - Setting Up MongoDB Atlas | إعداد MongoDB Atlas

## Goal
Provision a cloud MongoDB cluster, create a database user, allow application access, and produce a connection string the Next.js app will use as `MONGO_URI`.

## Background
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

## Implementation steps
1. Create a free/shared Atlas cluster in a region near your deploy target (e.g. `fra1`).
2. Create a database user with a strong password; URL-encode special characters in the connection string.
3. Add your dev IP (or temporary `0.0.0.0/0`) to the network allowlist; plan App Platform egress for staging.
4. Copy the Node.js connection string and set an explicit database name: `mongodb+srv://.../wazifa?retryWrites=true&w=majority`.
5. Add to `.env.local`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/wazifa?retryWrites=true&w=majority
```

6. Mirror `MONGO_URI` on DigitalOcean with **Run and build time** scope (required for Docker build in Lecture 092).

## Common Mistakes to Call Out
- Forgetting the database name → app connects to `test` and looks empty.
- Special characters in passwords that must be URL-encoded in the connection string.
- Atlas IP allowlist blocking DigitalOcean deploys.
- Committing `.env.local` to git (never do this).

## Key points
> Atlas is not "extra setup." It is how small teams get production-like persistence on day one.

> The connection string is a secret. Treat it like a password.

## End State
Students have a working Atlas cluster and a local `MONGO_URI` ready for Mongoose.

## Next
Lecture 084 wires the connection into Next.js through `lib/db.ts`.
