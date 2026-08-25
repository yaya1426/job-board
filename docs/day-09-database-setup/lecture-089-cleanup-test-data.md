# Lecture 089 - Applications: Cleanup Test Data | تنظيف بيانات الاختبار

## Goal

Teach students how to inspect and manually delete test application documents in MongoDB Atlas so local experiments do not pollute demos and admin tables.

## Explain It Simply (For Beginners)

During development you will apply to the same job many times with fake emails. That is normal. Before recording a clean demo or sharing a staging database, you need to **remove junk rows**.

Day 9 does not ship a "delete all test data" admin button. Manual Atlas cleanup is intentional — it reinforces where data actually lives.

## Recording Steps

1. Open MongoDB Atlas → Browse Collections → `applications`.
2. Identify test rows (obvious fake emails, duplicate applies, wrong job ids).
3. Delete individual documents or use a filter in the Atlas UI.
4. Optionally clean related `jobs` test documents the same way.
5. Refresh the admin applications page and confirm the table matches Atlas.
6. Mention that production apps eventually add:
   - seed scripts
   - staging-only reset routes
   - or separate databases per environment

## Safety Rules

- **Never** run destructive scripts against production without a backup.
- Prefer a dedicated `wazifa-dev` database or Atlas project for course work.
- Deleting applications does not delete jobs; explain independent collections.

## What We Are Not Building Yet

- Admin "delete application" action
- Automated test teardown
- Duplicate-application prevention (marked TODO in service)

## Key Teaching Lines

> If the UI looks wrong, verify Atlas first. The database is the source of truth.

> Test data cleanup is an ops skill, not a framework feature.

## End State

Students can confidently reset their applications collection between practice runs.

## Next

Lecture 090 derives applicant counts with MongoDB aggregation instead of storing counts on the job.
