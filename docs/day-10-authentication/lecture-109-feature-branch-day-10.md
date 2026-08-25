# Lecture 109 - Feature Branch for Day 10 | برانش جيتهاب لليوم العاشر

## Goal

Ship Day 10 authentication work through the same branching workflow as prior days: isolated feature branch, PR to `development`, staging verification, then production promotion.

## Explain It Simply (For Beginners)

Authentication touches env vars, cookies, proxy, and many files. Keep that work on a **feature branch** until staging proves login, signup, admin gate, and apply ownership all work together.

## Suggested Branch Name

```bash
feature/day-10-authentication
```

## Recording Steps

1. Branch from latest `development`.
2. Commit in teachable chunks matching lectures 096–106 (avoid one giant commit).
3. Ensure env vars on DigitalOcean:
   - `NEXTAUTH_SECRET` (runtime)
   - `NEXTAUTH_URL` (matches staging/prod URL)
   - `MONGO_URI` (unchanged from Day 9)
4. Open PR with test plan:
   - [ ] Signup creates user + profile
   - [ ] Auto-login after signup
   - [ ] Login/logout
   - [ ] Navbar reflects session
   - [ ] Guest apply prompt + callback return
   - [ ] Apply stores `candidateId` from session
   - [ ] Non-admin blocked from admin host dashboard
   - [ ] Admin role works after MongoDB change + re-login
   - [ ] Auth pages use `(auth)` layout on both hosts
5. Verify on `dev.wazifa.app` and `dev-admin.wazifa.app`.
6. Merge to `development`; tag/release per Day 7 workflow when ready.

## Auth-Specific Deploy Notes

- `NEXTAUTH_URL` must match the deployed origin (including `https://`).
- Cookie issues often trace to mismatched `NEXTAUTH_URL` or missing `NEXTAUTH_SECRET`.
- After deploy, test admin host login separately from public signup.

## Key Teaching Lines

> Auth is not done until it works on staging with real cookies and real domains.

> Re-login after role changes — document it in the PR test plan.

## End State

Day 10 changes follow team git workflow and pass staging auth checks.

## Next

Lecture 110 recaps Day 10 (partial — see day README for full summary).
