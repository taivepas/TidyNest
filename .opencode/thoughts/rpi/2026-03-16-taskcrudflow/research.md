---
date: "2026-03-16T00:00:00Z"
author: opencode
type: research
topic: "TaskCRUDflow"
status: complete
git_commit: "a57a6568f7ad536a2817c32357779d5ee4dddb52"
git_branch: "main"
last_updated: "2026-03-16T00:00:00Z"
last_updated_by: opencode
---

# Research: TaskCRUDflow

## Research Question

What currently exists in TidyNest for task data and dashboard task views, and what gaps must be addressed to support end-to-end task CRUD in a way that fits current backend/frontend architecture?

## Summary

The backend currently exposes read-only dashboard data endpoints under `/api` and includes one task-focused read endpoint (`GET /api/tasks/upcoming`), but no create, update, or delete task route exists. Route mapping remains centralized in a HomeData vertical slice, and handlers are thin minimal API functions that query EF Core and return DTOs.

Persistence for tasks already exists. `HouseTaskEntity` contains fields needed for basic CRUD (title, due date, room association, recurrence, completion status). The EF Core context is wired and seeded on startup, so adding mutation endpoints can build on an existing data layer rather than introducing new storage infrastructure.

The frontend is dashboard-only and consumes the read endpoints via a single API module. It has no forms, client mutation functions, or dedicated task management page yet. Therefore, TaskCRUDflow requires a new UI slice (or extension point) plus API contract additions while preserving current dashboard reads and contracts.

## Current State

### Backend API Surface

- Existing mapped endpoints are all in `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:9`.
- Current routes:
  - `GET /api/summary` (`TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:11`)
  - `GET /api/rooms` (`TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:12`)
  - `GET /api/tasks/upcoming` (`TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:13`)
  - `GET /api/activity/recent` (`TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:14`)
- No POST/PUT/PATCH/DELETE task endpoints currently exist.

### Data Model and Persistence

- Task entity exists in `TidyNest.Server/Data/Entities/HouseTaskEntity.cs:3` with key CRUD fields:
  - `Id`, `Title`, `DueAtUtc`, `RoomId`, `IsRecurring`, `IsCompleted`, `CompletedAtUtc`.
- EF DbSet for tasks exists in `TidyNest.Server/Data/TidyNestDbContext.cs:10`.
- Relationship to room is already modeled in `TidyNest.Server/Data/TidyNestDbContext.cs:37`.
- Startup applies migrations and seeds data in `TidyNest.Server/Program.cs:17`.

### Existing Task Read Behavior

- Upcoming task reads are implemented in `TidyNest.Server/Features/HomeData/Handlers/GetUpcomingTasksHandler.cs:9`.
- Query is no-tracking, ordered by due date, and projected to DTO in `TidyNest.Server/Features/HomeData/Handlers/GetUpcomingTasksHandler.cs:11`.
- DTO shape for current task reads is defined as `UpcomingTaskResponse` in `TidyNest.Server/Features/HomeData/HomeDataContracts.cs:15`.

### Frontend Usage of Task Data

- Client fetches dashboard slices from read-only API calls in `tidynest.client/src/features/dashboard/data/dashboardApi.ts:10`.
- Task type consumed by UI is `HouseholdTask` in `tidynest.client/src/features/dashboard/types/dashboard.ts:23`.
- Current dashboard renders upcoming tasks list only; no mutation UI exists in `tidynest.client/src/features/dashboard/pages/DashboardPage.tsx:44`.

## Gaps for TaskCRUDflow

1. Missing task mutation API contracts and endpoints (create/update/delete).
2. Missing request validation and consistent mutation error shape at API boundary.
3. Missing list/read endpoint strategy for non-dashboard task management views.
4. Missing frontend task management page/components/forms and API mutation client.
5. Missing behavior rules for completion toggling and due date updates.

## Constraints and Guidance

- Vertical-slice backend organization should be preserved (`docs/architecture.md:24`).
- API routes should remain resource-oriented under `/api` (`docs/api-guidelines.md:5`).
- Input validation is required at request boundaries (`docs/api-guidelines.md:18`).
- Frontend should remain feature-oriented with small focused components (`docs/architecture.md:43`).
- Required quality checks for this feature include backend build plus frontend lint/build (`.opencode/AGENTS.md:12`).

## Risks to Carry into Design

- Contract drift risk between new task CRUD endpoints and existing dashboard task contract.
- Potential timezone ambiguity if due dates are edited via local UI but stored as UTC.
- Risk of overloading `HomeData` slice if CRUD and dashboard concerns are not separated cleanly.

## Open Questions

- Should task CRUD endpoints live inside `HomeData` or in a dedicated `Tasks` feature slice while leaving dashboard reads in `HomeData`?
- Should “mark complete” be modeled as generic update or explicit action endpoint?
- Should dashboard continue consuming `/api/tasks/upcoming` as-is or move to shared task query endpoint?
