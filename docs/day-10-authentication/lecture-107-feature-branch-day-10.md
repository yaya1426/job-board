# Lecture 107 - Feature Branch for Day (10) | برانش جيتهاب لليوم العاشر

## Goal
Ship Day 10 authentication work through the same branching workflow as prior days: isolated feature branch, PR to `development`, staging verification, then production promotion.

## Background
Authentication touches env vars, cookies, proxy, and many files. Keep that work on a **feature branch** until staging proves login, signup, admin gate, and apply ownership all work together.

## Suggested Branch Name
```bash
feature/day-10-authentication
```

## Implementation steps
1. `git checkout development && git pull && git checkout -b feature/day-10-authentication`.
2. Commit in lecture-sized chunks (096–106), not one giant commit.
3. Ensure DigitalOcean env vars: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (matches staging origin), `MONGO_URI`.
4. Open PR with test plan: signup + auto-login, login/logout, navbar state, apply prompt + callback, admin proxy gate, `(auth)` layout on both hosts.
5. Verify on `dev.wazifa.app` and `dev-admin.wazifa.app`.
6. Document re-login requirement after manual MongoDB role change in PR test plan.

## Auth-Specific Deploy Notes
- `NEXTAUTH_URL` must match the deployed origin (including `https://`).
- Cookie issues often trace to mismatched `NEXTAUTH_URL` or missing `NEXTAUTH_SECRET`.
- After deploy, test admin host login separately from public signup.

## Key points
> Auth is not done until it works on staging with real cookies and real domains.

> Re-login after role changes — document it in the PR test plan.

## End State
Day 10 changes follow team git workflow and pass staging auth checks.

## Next
[Lecture 108 — Admin Auth State in Sidebar](./lecture-108-admin-auth-state-in-sidebar.md) shows the signed-in admin name and sign-out in the dashboard sidebar.
