---
date: "2026-03-16T00:00:00Z"
author: opencode
type: plan
topic: "TaskCRUDflow"
status: draft
related_ticket: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/ticket.md"
related_research: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/research.md"
related_design: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/design.md"
related_structure: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/structure.md"
last_updated: "2026-03-16T00:00:00Z"
last_updated_by: opencode
---

# Implementation Plan: TaskCRUDflow

## Overview

Implement end-to-end task CRUD for MVP by adding a dedicated backend tasks slice (`/api/tasks`) and a new frontend tasks feature, while preserving current dashboard endpoints and behavior.

## Current State Snapshot

- Backend currently maps read-only dashboard routes in `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:9`.
- Task persistence already exists (`TidyNest.Server/Data/Entities/HouseTaskEntity.cs:3`, `TidyNest.Server/Data/TidyNestDbContext.cs:10`).
- Frontend currently reads dashboard data only (`tidynest.client/src/features/dashboard/data/dashboardApi.ts:10`) and has no task mutation UX.

## Desired End State

- API supports create, read list/detail, update, and delete for tasks under `/api/tasks`.
- Validation and error responses are consistent for task mutation flows.
- Frontend has a dedicated tasks page with create/edit/delete interactions and clear loading/empty/error states.
- Existing dashboard read flows remain working without contract breaks.

## Out of Scope

- Advanced recurrence rule editing.
- Auth/authorization changes.
- Notification/reminder workflows.

---

## Phase 1: Backend Task CRUD API Slice

### Goal

Create and wire a dedicated backend vertical slice for task CRUD with DTO contracts and boundary validation.

### Files to Add

- `TidyNest.Server/Features/Tasks/MapTaskEndpoints.cs`
- `TidyNest.Server/Features/Tasks/TaskContracts.cs`
- `TidyNest.Server/Features/Tasks/TaskValidation.cs` (if needed)
- `TidyNest.Server/Features/Tasks/Handlers/GetTasksHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/GetTaskByIdHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/CreateTaskHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/UpdateTaskHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/DeleteTaskHandler.cs`

### Files to Modify

- `TidyNest.Server/Program.cs` (map task endpoints)

### Implementation Notes

- Keep routes resource-oriented under `/api/tasks`.
- Use explicit request/response DTOs; do not reuse dashboard response contracts.
- Validate title, due date, and room references at handler boundary.
- Use `Results.BadRequest(...)` for validation failures and `Results.NotFound(...)` for missing entities.
- Keep timestamps ISO-compatible via existing `ToString("O")` pattern.

### Success Criteria

#### Automated

- [ ] `dotnet build TidyNest.slnx`

#### Manual

- [ ] `GET /api/tasks` returns seeded tasks.
- [ ] `GET /api/tasks/{id}` returns 200 for existing id and 404 for unknown id.
- [ ] `POST /api/tasks` persists a new task and returns created payload.
- [ ] `PUT /api/tasks/{id}` updates core fields and completion state.
- [ ] `DELETE /api/tasks/{id}` removes task and subsequent read returns 404.

**PAUSE GATE**: Human verification before frontend implementation.

---

## Phase 2: Frontend Tasks Feature and API Client

### Goal

Add a dedicated tasks feature area with list/form interactions backed by the new `/api/tasks` endpoints.

### Files to Add

- `tidynest.client/src/features/tasks/index.ts`
- `tidynest.client/src/features/tasks/types/tasks.ts`
- `tidynest.client/src/features/tasks/data/tasksApi.ts`
- `tidynest.client/src/features/tasks/hooks/useTasksData.ts`
- `tidynest.client/src/features/tasks/pages/TasksPage.tsx`
- `tidynest.client/src/features/tasks/components/TaskList.tsx`
- `tidynest.client/src/features/tasks/components/TaskForm.tsx`
- `tidynest.client/src/features/tasks/components/TaskRow.tsx`
- `tidynest.client/src/features/tasks/styles/tasks.css`

### Files to Modify

- `tidynest.client/src/App.tsx` (expose or switch into Tasks page)

### Implementation Notes

- Keep component responsibilities narrow (form/list/row separation).
- Centralize HTTP logic in `tasksApi.ts`; do not call fetch directly from UI components.
- Provide loading, empty, error states with actionable copy.
- After create/update/delete actions, refresh task list predictably.

### Success Criteria

#### Automated

- [ ] `npm run lint` (from `tidynest.client`)
- [ ] `npm run build` (from `tidynest.client`)

#### Manual

- [ ] User can create a task from UI and see it in the list.
- [ ] User can edit an existing task and see updated data after refresh.
- [ ] User can delete a task and it no longer appears.
- [ ] Empty state renders useful guidance when no tasks exist.
- [ ] Error state appears when API call fails and allows retry.

**PAUSE GATE**: Human UX review on desktop and mobile widths.

---

## Phase 3: Integration Hardening and Regression Checks

### Goal

Ensure new tasks flow does not break existing dashboard behavior and finalize verification evidence.

### Files to Modify (as needed)

- `tidynest.client/src/features/dashboard/data/dashboardApi.ts` (only if compatibility updates are required)
- `tidynest.client/src/features/dashboard/pages/DashboardPage.tsx` (only if navigation/entry adjustment is needed)
- `TidyNest.Server/Features/HomeData/*` (only if additive compatibility fixes are required)

### Implementation Notes

- Keep `/api/tasks/upcoming` behavior stable for dashboard usage.
- Avoid changing dashboard contract fields already consumed by UI.
- Limit changes to compatibility fixes discovered in verification.

### Success Criteria

#### Automated

- [ ] `dotnet build TidyNest.slnx`
- [ ] `npm run lint` (from `tidynest.client`)
- [ ] `npm run build` (from `tidynest.client`)

#### Manual

- [ ] Dashboard loads successfully and still shows upcoming tasks.
- [ ] New tasks created via tasks page are reflected in relevant reads.
- [ ] No regressions in existing room/activity/summary dashboard sections.

**PAUSE GATE**: Final human sign-off before merge/PR creation.

---

## Verification Commands

Run from repo root unless noted:

- `dotnet build TidyNest.slnx`
- `dotnet run --project TidyNest.Server` (for local API/manual verification)
- `npm run lint` (in `tidynest.client`)
- `npm run build` (in `tidynest.client`)

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Validation inconsistency across create/update handlers | Centralize shared checks in `TaskValidation.cs` when duplication emerges. |
| Timezone confusion in due dates | Normalize input to UTC and preserve ISO timestamp serialization. |
| Dashboard regressions from task API additions | Treat HomeData routes/contracts as stable and verify dashboard manually in Phase 3. |

## Execution Readiness

This plan is ready for implementation phase execution in small increments with phase gates.
