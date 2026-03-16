---
date: "2026-03-16T00:00:00Z"
author: opencode
type: structure
topic: "TaskCRUDflow"
status: draft
related_ticket: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/ticket.md"
related_research: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/research.md"
related_design: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/design.md"
last_updated: "2026-03-16T00:00:00Z"
last_updated_by: opencode
---

# Structure: TaskCRUDflow

## Artifact Goal

Define the file-level structure and ownership boundaries for implementing task CRUD without beginning execution planning.

## Backend Structure

### Existing Files to Extend

- `TidyNest.Server/Program.cs`
  - Ensure new task routes are mapped via feature extension.
- `TidyNest.Server/Data/Entities/HouseTaskEntity.cs`
  - Reuse existing entity fields; no structural expansion required for MVP CRUD.
- `TidyNest.Server/Data/TidyNestDbContext.cs`
  - Reuse `Tasks` DbSet and room relationship.

### New Feature Slice (preferred)

- `TidyNest.Server/Features/Tasks/MapTaskEndpoints.cs`
  - Route mapping for `/api/tasks` resource routes.
- `TidyNest.Server/Features/Tasks/TaskContracts.cs`
  - Request/response DTOs for CRUD operations.
- `TidyNest.Server/Features/Tasks/Handlers/GetTasksHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/GetTaskByIdHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/CreateTaskHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/UpdateTaskHandler.cs`
- `TidyNest.Server/Features/Tasks/Handlers/DeleteTaskHandler.cs`

### Optional Shared Helper (if needed)

- `TidyNest.Server/Features/Tasks/TaskValidation.cs`
  - Consolidate request validation logic to avoid duplication across create/update handlers.

## Frontend Structure

### Existing Files to Extend

- `tidynest.client/src/App.tsx`
  - Wire Tasks page entry point (routing or switch pattern based on current app style).

### New Task Feature Area

- `tidynest.client/src/features/tasks/index.ts`
- `tidynest.client/src/features/tasks/pages/TasksPage.tsx`
- `tidynest.client/src/features/tasks/types/tasks.ts`
- `tidynest.client/src/features/tasks/data/tasksApi.ts`
- `tidynest.client/src/features/tasks/hooks/useTasksData.ts`
- `tidynest.client/src/features/tasks/components/TaskList.tsx`
- `tidynest.client/src/features/tasks/components/TaskForm.tsx`
- `tidynest.client/src/features/tasks/components/TaskRow.tsx`
- `tidynest.client/src/features/tasks/styles/tasks.css`

### API Contract Boundary

- `tasksApi.ts` owns HTTP calls and payload typing.
- UI components consume typed hook state, not raw fetch responses.

## Boundary and Dependency Rules

- Dashboard feature remains independent and continues to consume existing `/api/*` HomeData endpoints.
- Tasks feature should not import dashboard-specific types.
- Backend `HomeData` and `Tasks` slices can share persistence layer (`TidyNestDbContext`) but keep route mapping and contracts separated by feature.

## Verification Surface (for next phase)

- Backend compile impact: `TidyNest.Server/Program.cs` + new files in `TidyNest.Server/Features/Tasks/`.
- Frontend compile impact: `tidynest.client/src/App.tsx` + new files in `tidynest.client/src/features/tasks/`.

## Stop Gate

Structure artifact is complete. Next step is plan generation, intentionally deferred for human decision.
