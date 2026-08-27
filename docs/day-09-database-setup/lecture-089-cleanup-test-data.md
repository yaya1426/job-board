# Lecture 089 - Applications: Cleanup Test Data | تنظيف بيانات الاختبار

## Goal
This section covers how to inspect and manually delete test application documents in MongoDB Atlas so local experiments do not pollute demos and admin tables.

## Background
During development you will apply to the same job many times with fake emails. That is normal. Before recording a clean demo or sharing a staging database, you need to **remove junk rows**.

Day 9 does not ship a "delete all test data" admin button. Manual Atlas cleanup is intentional — it reinforces where data actually lives.

## Implementation steps
1. Open MongoDB Atlas → Browse Collections → `applications`.
2. Identify test rows (fake emails, duplicate applies, wrong job ids).
3. Delete individual documents or filter-delete in the Atlas UI.
4. Optionally clean test `jobs` documents the same way.
5. Refresh the admin applications page — UI must match Atlas (database is source of truth).
6. Do **not** add an admin delete action yet; duplicate-application prevention remains a service TODO.

## Safety Rules
- **Never** run destructive scripts against production without a backup.
- Prefer a dedicated `wazifa-dev` database or Atlas project for course work.
- Deleting applications does not delete jobs; explain independent collections.

## What We Are Not Building Yet
- Admin "delete application" action
- Automated test teardown
- Duplicate-application prevention (marked TODO in service)

## Key points
> If the UI looks wrong, verify Atlas first. The database is the source of truth.

> Test data cleanup is an ops skill, not a framework feature.

## End State
You should be able to confidently reset their applications collection between practice runs.

## Next
Lecture 090 derives applicant counts with MongoDB aggregation instead of storing counts on the job.
