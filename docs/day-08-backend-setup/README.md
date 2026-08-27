# Day (8) Backend Setup in Next.js

## Goal

Move from purely mocked UI to a backend-oriented project structure using Server Actions, services, validation, and form state handling.

## Lecture Index

- [Lecture 66 - Day (8) Plan](./lecture-066-day-8-plan.md)
- [Lecture 67 - How to Approach Backend in Next.js](./lecture-067-how-to-approach-backend-in-nextjs.md)
- [Lecture 68 - Using Server Functions (Actions)](./lecture-068-using-server-functions-actions.md)
- [Lecture 69 - Creating API Endpoints in Next (Route Handlers)](./lecture-069-creating-api-endpoints-route-handlers.md)
- [Lecture 70 - Route Handlers + Server Actions](./lecture-070-route-handlers-and-server-actions.md)
- [Lecture 71 - Create Job Server Action + Logic](./lecture-071-create-job-server-action-and-logic.md)
- [Lecture 72 - Install & Use Zod Schema Validator](./lecture-072-install-and-use-zod-schema-validator.md)
- [Lecture 73 - useActionState Hook for Handling Form State](./lecture-073-useactionstate-hook-for-form-state.md)
- [Lecture 74 - Form Validation for TextArea and Select](./lecture-074-form-validation-for-textarea-and-select.md)
- [Lecture 75 - Feature Branch for Day (8)](./lecture-075-feature-branch-for-day-8.md)
- [Lecture 76 - Jobs: Refactor JobData into Service Functions (1)](./lecture-076-jobs-refactor-jobdata-into-service-functions-1.md)
- [Lecture 77 - Jobs: Refactor Components Data into Service Functions (2)](./lecture-077-jobs-refactor-components-data-into-service-functions-2.md)
- [Lecture 78 - Applications: Refactor into Service Functions](./lecture-078-applications-refactor-into-service-functions.md)
- [Lecture 79 - Candidates: Refactor into Service Functions](./lecture-079-candidates-refactor-into-service-functions.md)
- [Lecture 80 - Recap Day (8)](./lecture-080-recap-day-8.md)

## Commit Evidence

Primary commits found for this day:

- `b4ba20f` - Day 8: Create Job + Validation
- `7938a5d` - Day 8: jobs service integration
- `3e60d0e` - Day 8: candidate data from service function

The history also contains duplicated Day 8 commits after branch merges:

- `9394328` - Day 8: Create Job + Validation
- `1a550c3` - Day 8: jobs service integration
- `f4d8256` - Day 8: candidate data from service function

Key files added/changed:

- `app/actions/jobs/jobs.action.ts`
- `services/jobs/jobs.service.ts`
- `services/jobs/jobs.validation.ts`
- `services/applications/applications.service.ts`
- `services/candidates/candidates.service.ts`
- `types/ServiceResult.ts`
- `components/job-management/CreateJobForm.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- Many pages/components switched from direct mock data to service functions.

## Final State

By the end of the day, the project had:

- Server Actions for mutations.
- Services as the business-logic layer.
- Zod schemas next to services.
- `ServiceResult<T>` for success/error return shape.
- `useActionState` used to display field-level form errors.
- Jobs, applications, and candidates moved behind service functions.

The data was still mock/static at this stage, but components were no longer supposed to reach into mock files directly.

## Architecture Decisions

The project started to follow the one-direction flow:

```txt
Server Action / Server Component
  -> Service
  -> Data source
```

Repositories were not yet the main abstraction; that arrives on Day 9 when Mongoose introduces document/database concerns.

Validation conventions also settled here:

- Validation schema lives beside the service.
- Service calls `safeParse`.
- Errors are flattened with `z.flattenError(...).fieldErrors`.
- Forms receive field errors through `useActionState`.

## Reference Guide

Day 8 bridges frontend and backend: Next.js handles server-side work through Server Actions and Route Handlers, then narrows to thin actions, service logic, and zod validation. The goal is not yet a real database — it is to stop components from owning data logic.

## Reference Notes

- The duplicate Day 8 commits appear to come from branch history/merges. The docs treat them as the same implemented work, not two separate lessons.
