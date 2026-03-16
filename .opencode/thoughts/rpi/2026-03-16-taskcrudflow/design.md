---
date: "2026-03-16T00:00:00Z"
author: opencode
type: design
topic: "TaskCRUDflow"
status: draft
related_ticket: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/ticket.md"
related_research: ".opencode/thoughts/rpi/2026-03-16-taskcrudflow/research.md"
last_updated: "2026-03-16T00:00:00Z"
last_updated_by: opencode
---

# Design: TaskCRUDflow

## Objective

Provide a complete task create/read/update/delete flow for MVP while preserving existing dashboard behavior and aligning with TidyNest vertical-slice/API conventions.

## Design Principles

- Keep dashboard reads stable and additive.
- Introduce explicit task-focused API contracts rather than reusing dashboard DTOs.
- Validate mutation input at API boundaries with clear 400 responses.
- Keep handlers thin and data access via `TidyNestDbContext`.
- Keep frontend compositional with small components and a focused task feature area.

## Backend API Design

### Route Strategy

Add a dedicated tasks resource group under `/api/tasks`:

- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

Optional follow-up action route (if needed during planning):

- `POST /api/tasks/{id}/complete`

### Contracts

Introduce task CRUD contracts separate from dashboard contracts:

- `TaskItemResponse` (id, title, dueAt, roomId, isRecurring, isCompleted, completedAt)
- `CreateTaskRequest` (title, dueAt, roomId, isRecurring)
- `UpdateTaskRequest` (title, dueAt, roomId, isRecurring, isCompleted)

Reuse existing ISO 8601 timestamp conventions used by HomeData handlers.

### Validation

At handler boundary enforce:

- `title` required, trimmed, non-empty, max length aligned with entity (`<= 500`).
- `dueAt` required for create and parseable timestamp.
- `roomId` must reference existing room when provided.
- `isCompleted=true` should set `completedAt` when not provided; `isCompleted=false` should clear `completedAt`.

Error behavior:

- `400` invalid payload or validation failure.
- `404` missing task id.

## Persistence Behavior

Leverage existing entity `HouseTaskEntity` in `TidyNest.Server/Data/Entities/HouseTaskEntity.cs:3`.

- No schema change required for basic CRUD.
- Mapping between request DTO and entity handled in handlers (or a small mapper utility if needed).
- Keep `DueAtUtc` and `CompletedAtUtc` stored in UTC.

## Frontend Design

### Feature Placement

Create a new task management feature under `tidynest.client/src/features/tasks/` while keeping dashboard feature intact.

Proposed components:

- `pages/TasksPage.tsx`
- `components/TaskList.tsx`
- `components/TaskForm.tsx`
- `components/TaskRow.tsx`
- `hooks/useTasksData.ts`
- `data/tasksApi.ts`
- `types/tasks.ts`

### UX States

- Loading: list skeleton or inline loading text.
- Empty: guidance text and primary create action.
- Error: actionable message with retry.
- Success: optimistic-safe refresh after create/update/delete.

### App Integration

- Add route-level switch or simple page toggle from existing app shell depending on current routing approach.
- Keep dashboard fetch path unchanged for now (`/api/tasks/upcoming` remains).

## Non-Goals in This Change

- No advanced recurrence rule editing.
- No multi-user assignment/auth logic.
- No notification/reminder workflow.

## Verification Expectations

- Backend: `dotnet build TidyNest.slnx`
- Frontend: `npm run lint` and `npm run build` in `tidynest.client`
- Manual: create task, edit task, delete task, refresh and confirm persistence, confirm dashboard still loads.

## Decisions Ready for Structure

- Use dedicated `/api/tasks` CRUD routes.
- Keep dashboard contracts and endpoints stable.
- Build tasks UI in separate frontend feature folder.
- Use explicit request/response DTOs and boundary validation.
