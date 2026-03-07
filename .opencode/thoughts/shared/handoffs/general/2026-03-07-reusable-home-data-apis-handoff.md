# Handoff: Reusable Home Data APIs (Mocked Backend)

## Context

- Date: 2026-03-07
- Plan executed: `.opencode/thoughts/plans/2026-03-07-ui-data-from-reusable-backend-apis.md`
- Goal: Move dashboard runtime data loading from frontend-local mocks to reusable backend APIs under `/api/*`, keeping data mocked in backend handlers for now.

## What Was Implemented

### Backend

- Added DTO contracts:
  - `TidyNest.Server/Features/HomeData/HomeDataContracts.cs`
- Added reusable API endpoint mappings:
  - `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs`
- Wired endpoints into startup:
  - `TidyNest.Server/Program.cs` now calls `app.MapHomeData()`

Implemented endpoints:

- `GET /api/summary`
- `GET /api/rooms`
- `GET /api/tasks/upcoming`
- `GET /api/activity/recent`

### Frontend

- Switched dashboard data adapter from local mock return to HTTP fetch calls:
  - `tidynest.client/src/features/dashboard/data/dashboardApi.ts`
- Updated hook fallback error text for API loading:
  - `tidynest.client/src/features/dashboard/hooks/useDashboardData.ts`
- Added Vite proxy for `/api`:
  - `tidynest.client/vite.config.ts`
- Removed obsolete runtime mock file:
  - `tidynest.client/src/features/dashboard/data/dashboardMockData.ts` (deleted)

### Documentation

- Added reusable API contract section to:
  - `README.md`

## Important Follow-up Fix Applied

After validation, backend enum-like payload values were normalized to match frontend types exactly:

- Room status now uses: `clean | needs_tidy | deep_clean`
- Activity type now uses: `task_completed | task_added | note` (current mock uses first two)

File updated:

- `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs`

## Verification Run

Commands executed successfully:

- `dotnet build TidyNest.slnx`
- `dotnet test TidyNest.slnx`
- `npm run lint` (in `tidynest.client`)
- `npm run build` (in `tidynest.client`)

## Current State

- Dashboard data now comes from backend APIs (no frontend runtime mock import path).
- Reusable `/api/*` routes are available for use from other pages.
- Plan checkboxes for automated verification phases have been marked complete.

## Suggested Next Steps

1. Run a quick manual smoke check with the app running:
   - Confirm dashboard loads and renders all sections from API data.
   - Confirm loading and error UI states still behave as expected.
2. Add integration tests for `/api/*` contracts and frontend data mapping.
3. If desired, proceed with commit/PR.
