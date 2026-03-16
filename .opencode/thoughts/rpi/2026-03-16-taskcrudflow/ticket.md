# Ticket: TaskCRUDflow

- Ticket pointer: `@.opencode/thoughts/rpi/2026-03-16-taskcrudflow/ticket.md`
- Created: 2026-03-16
- Owner: opencode
- Status: active

## Request

Start the phased dev workflow for `TaskCRUDflow` and prepare artifacts through structure so implementation planning can begin in a later session.

## Product Intent

Enable MVP task management by adding a complete create/read/update/delete flow for household tasks while keeping existing dashboard behavior intact.

## Scope Constraints

- Keep vertical-slice backend structure under `TidyNest.Server/Features/`.
- Keep React feature-oriented structure under `tidynest.client/src/features/`.
- Preserve current dashboard data contracts while introducing task CRUD contracts intentionally.
- Stop workflow after structure; do not start plan or implementation in this run.

## Known Context

- Existing API surface is read-only dashboard data under `/api` in `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:7`.
- Existing task entity already exists in persistence layer in `TidyNest.Server/Data/Entities/HouseTaskEntity.cs:3`.
- Frontend currently consumes dashboard endpoints only in `tidynest.client/src/features/dashboard/data/dashboardApi.ts:9`.
