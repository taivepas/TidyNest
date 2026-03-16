# Research Questions: TaskCRUDflow

- Ticket: `@.opencode/thoughts/rpi/2026-03-16-taskcrudflow/ticket.md`
- Date: 2026-03-16
- Phase: questions

## Goal

Define what currently exists for task data and delivery, what is missing for full task CRUD, and what constraints shape implementation.

## Questions

1. What API routes exist today, and do any support task create, update, or delete?
2. What task persistence model already exists in EF Core?
3. Which dashboard endpoints and client contracts depend on current task data?
4. Where should new task CRUD endpoints live to match existing vertical-slice patterns?
5. What validation and error response behavior should be standardized for task mutations?
6. What frontend structure exists today, and where should a task CRUD UI surface be added?
7. What verification gates are required for backend and frontend before merge?

## Evidence Targets

- `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs`
- `TidyNest.Server/Features/HomeData/HomeDataContracts.cs`
- `TidyNest.Server/Data/Entities/HouseTaskEntity.cs`
- `TidyNest.Server/Data/TidyNestDbContext.cs`
- `tidynest.client/src/features/dashboard/data/dashboardApi.ts`
- `tidynest.client/src/features/dashboard/types/dashboard.ts`
- `docs/architecture.md`
- `docs/api-guidelines.md`
- `docs/coding-standards.md`

## Exit Criteria

- Current-state API and data flow are mapped with concrete file references.
- Implementation constraints are explicit.
- Inputs needed for design and structure are documented.
