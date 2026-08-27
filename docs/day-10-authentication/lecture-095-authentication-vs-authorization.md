# Lecture 095 - Authentication vs Authorization

## Goal
Separate **authentication** (who you are) from **authorization** (what you may do) before wiring NextAuth — so each later lecture lands in the right mental bucket.

## Background
These terms are often mixed up. In wazifa.app they show up in different layers:

| Concept | Question | Examples in this project |
|---------|----------|--------------------------|
| **Authentication** | Who is this person? | Login, signup, JWT session, `getCurrentUser()`, `session.user.id` |
| **Authorization** | What may they do? | `role === "ADMIN"` in proxy, dashboard layout, `handleCreateJob` |

Authentication without authorization still leaks data: a signed-in candidate must not reach admin mutations.

Authorization without authentication is meaningless: you must know the user before checking their role.

## How the course applies both

### Authentication path
```txt
SignupForm / LoginForm
  -> NextAuth CredentialsProvider
  -> verifyCredentials (service)
  -> JWT cookie with id + role
  -> getCurrentUser() / useSession()
```

### Authorization path
```txt
Request to admin host
  -> proxy.ts: getToken() + role check
  -> dashboard layout: getCurrentUser() + role check
  -> Server Action: getCurrentUser() + role check before mutate
```

## Common mistakes to avoid
- Hiding admin links in the navbar **without** server-side checks — UI is not security.
- Trusting `candidateId` or `role` from a form field — derive identity from `getCurrentUser()` on the server.
- Changing a user's role in MongoDB and expecting the session to update — JWT must be refreshed (re-login).

## Implementation steps
1. Write two columns on paper: auth vs authz. Place signup/login/session under auth; place proxy, layout gates, and action checks under authz.
2. Skim `proxy.ts` and note it reads the JWT — it does not call `getServerSession()`.
3. Skim `applyToJob` and `handleCreateJob` — both use `getCurrentUser()` for ownership/role, not client props.
4. Read supplementary [RBAC notes](./supplementary/lecture-107-rbac-supplementary.md) after the main track — ad-hoc role checks today, no centralized permission helper yet.

## Key points
> `authorize` in NextAuth is authentication. `role === "ADMIN"` in proxy or actions is authorization.

> Defense in depth: proxy blocks early; layout and Server Actions repeat checks if a request slips through.

## Verify
- You can explain why `ApplyAuthPrompt` is UX, not security.
- You can name three places authorization is enforced in the current repo.

## Next
[Lecture 096 — Installing and Configuring NextAuth.js](./lecture-096-nextauth-install.md) mounts the auth library and JWT session strategy.
