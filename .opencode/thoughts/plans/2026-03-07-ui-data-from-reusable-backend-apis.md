---
date: "2026-03-07T12:35:00Z"
author: opencode
type: plan
topic: "UI data sourced from reusable backend APIs using vertical slices"
status: draft
git_commit: "f6ba065c51e0c04c15328a11389202d1f49fbbfc"
git_branch: "main"
related_research: "None"
last_updated: "2026-03-07T12:48:00Z"
last_updated_by: opencode
last_updated_note: "Updated API route design to remove /dashboard prefix so endpoints are reusable across pages"
---

# Reusable Backend APIs for UI Data Implementation Plan

## Overview

We will move dashboard data loading from frontend-local mock returns to backend API endpoints, while keeping mock data for now behind the server handlers. The implementation will follow a vertical slice approach for the dashboard consumer, but API routes will be reusable resource endpoints under `/api/*` (no `/api/dashboard` prefix) so other pages can consume the same data contracts.

## Current State Analysis

- Backend currently does not expose dashboard APIs; `TidyNest.Server/Program.cs:1-22` only configures static assets, OpenAPI (dev), HTTPS redirection, and SPA fallback.
- Frontend data boundary exists and is clean: `tidynest.client/src/features/dashboard/data/dashboardApi.ts:15-18` returns `dashboardMockData` via `setTimeout`.
- Dashboard hook consumes only the boundary function (`tidynest.client/src/features/dashboard/hooks/useDashboardData.ts:23`) and handles loading/error state already (`:24-35`).
- Dashboard contract is already explicit in `tidynest.client/src/features/dashboard/types/dashboard.ts:52-57` (`summary`, `rooms`, `upcomingTasks`, `familyActivity`).
- Frontend dev proxy currently only maps `^/weatherforecast` in `tidynest.client/vite.config.ts:48-55`, so new resource API calls are not routed yet in Vite dev.

## Desired End State

Dashboard page data is fetched from backend endpoints only, using reusable resource routes under `/api/*`. Backend returns mocked data directly from handlers (no DB yet), and frontend data adapter uses HTTP calls while preserving typed contracts and existing UI loading/error behavior.

### Key Discoveries

- Existing dashboard slice already has the right separation (types → data adapter → hook → sections), so the migration can be done with minimal UI refactor.
- No backend feature folders/endpoints exist yet, so we can introduce a clean first vertical slice in server without compatibility concerns.
- Project docs require DTO contracts and resource-oriented API routes (`docs/api-guidelines.md`), which align with the selected reusable multi-endpoint approach.

## What We're NOT Doing

- No persistence/database integration.
- No authentication/authorization changes.
- No expansion beyond dashboard feature (tasks/rooms feature modules outside dashboard scope are out).
- No frontend design overhaul; only data-source and plumbing changes needed for backend-driven flow.

## Implementation Approach

Create a backend dashboard vertical slice with explicit response DTOs and multiple GET endpoints:

- `GET /api/summary`
- `GET /api/rooms`
- `GET /api/tasks/upcoming`
- `GET /api/activity/recent`

Then update the frontend feature adapter to fetch all slices via HTTP and compose the existing `DashboardData` shape for the hook/UI. This keeps the current UI contract stable while shifting source-of-truth to server APIs.

---

## Phase 1: Add Backend Reusable Resource APIs with Mocked Endpoint Data

### Overview

Introduce reusable resource API endpoints and DTOs in the server. Endpoints return mocked data directly from handlers so frontend can consume real HTTP responses without adding persistence yet.

### Changes Required

#### 1. Server feature slice structure

**File**: `TidyNest.Server/Features/HomeData/HomeDataContracts.cs` (new)

**Changes**: Add DTO records mirroring current frontend contract slices.

```csharp
namespace TidyNest.Server.Features.HomeData;

public sealed record DashboardSummaryResponse(
    int TodayTasksTotal,
    int TodayTasksCompleted,
    int RoomsNeedingAttention,
    int WeeklyProgressPercent);

public sealed record RoomStatusResponse(
    string Id,
    string Name,
    string Status,
    string LastCleanedAt);

public sealed record UpcomingTaskResponse(
    string Id,
    string Title,
    string DueAt,
    string? RoomId,
    bool IsRecurring);

public sealed record ActivityItemResponse(
    string Id,
    string Type,
    string Timestamp,
    string Description,
    string Actor);
```

**Why**: Makes backend API contracts explicit and stable, aligned with API guidelines.

#### 2. Endpoint mapping for reusable resources

**File**: `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs` (new)

**Changes**: Add endpoint registration extension and inline mocked payload returns in handlers.

```csharp
namespace TidyNest.Server.Features.HomeData;

public static class MapHomeDataEndpoints
{
    public static IEndpointRouteBuilder MapHomeData(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/summary", () => Results.Ok(new DashboardSummaryResponse(7, 3, 2, 64)));
        group.MapGet("/rooms", () => Results.Ok(new[] { /* mocked room DTOs */ }));
        group.MapGet("/tasks/upcoming", () => Results.Ok(new[] { /* mocked task DTOs */ }));
        group.MapGet("/activity/recent", () => Results.Ok(new[] { /* mocked activity DTOs */ }));

        return app;
    }
}
```

**Why**: Implements user-selected multi-endpoint model with reusable routes for current and future pages.

#### 3. Wire endpoints into startup

**File**: `TidyNest.Server/Program.cs`

**Changes**: Register dashboard endpoints before SPA fallback.

```csharp
using TidyNest.Server.Features.HomeData;

// existing middleware...

app.MapHomeData();

app.MapFallbackToFile("/index.html");
```

**Why**: Ensures API routes are active and discoverable in development.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Tests pass: `dotnet test TidyNest.slnx` (or confirm no test projects yet)
- [x] Type check: `dotnet build TidyNest.slnx`

#### Manual Verification

- [ ] `GET /api/summary` returns 200 + expected JSON shape.
- [ ] `GET /api/rooms` returns 200 + non-empty mocked array.
- [ ] `GET /api/tasks/upcoming` and `/api/activity/recent` return 200 + expected fields.

**⏸️ PAUSE**: Wait for human verification before Phase 2

---

## Phase 2: Switch Frontend Dashboard Adapter to Backend APIs

### Overview

Replace frontend-local mock return path with HTTP calls to backend reusable endpoints and compose the existing `DashboardData` type to avoid UI component changes.

### Changes Required

#### 1. Replace mock adapter implementation with HTTP client logic

**File**: `tidynest.client/src/features/dashboard/data/dashboardApi.ts`

**Changes**: Replace `setTimeout + dashboardMockData` with four `fetch` calls and typed mapping.

```ts
import type { DashboardData } from '../types/dashboard';

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Dashboard API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [summary, rooms, upcomingTasks, familyActivity] = await Promise.all([
    getJson<DashboardData['summary']>('/api/summary'),
    getJson<DashboardData['rooms']>('/api/rooms'),
    getJson<DashboardData['upcomingTasks']>('/api/tasks/upcoming'),
    getJson<DashboardData['familyActivity']>('/api/activity/recent'),
  ]);

  return { summary, rooms, upcomingTasks, familyActivity };
}
```

**Why**: Makes all dashboard data backend-driven without changing consumers.

#### 2. Keep hook and UI stable; only adapt error messaging if needed

**File**: `tidynest.client/src/features/dashboard/hooks/useDashboardData.ts`

**Changes**: Preserve structure; optionally refine fallback error text for API failures.

```ts
const normalizedError =
  error instanceof Error ? error : new Error('Failed to load dashboard data from API');
```

**Why**: Maintains current loading/error UX and minimizes risk.

#### 3. Ensure Vite dev proxy routes reusable APIs to backend

**File**: `tidynest.client/vite.config.ts`

**Changes**: Add proxy rule for `/api` to same backend target currently used by weatherforecast.

```ts
server: {
  proxy: {
    '^/weatherforecast': { target, secure: false },
    '^/api': { target, secure: false },
  }
}
```

**Why**: Supports local frontend dev against backend API routes without CORS issues.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Frontend lint passes: `npm run lint` (in `tidynest.client`)
- [x] Type check/build passes: `npm run build` (in `tidynest.client`)

#### Manual Verification

- [ ] Dashboard loads with data when server is running (no direct frontend mock dependency).
- [ ] Loading state appears briefly and resolves successfully.
- [ ] Error state appears if one `/api/*` endpoint is intentionally unavailable.

**⏸️ PAUSE**: Wait for human verification before Phase 3

---

## Phase 3: Contract Hardening and Cleanup

### Overview

Finalize the backend-driven flow by documenting contracts, removing obsolete mock import coupling, and validating edge behaviors to prepare for future real data source replacement.

### Changes Required

#### 1. Remove no-longer-used frontend local mock coupling

**File**: `tidynest.client/src/features/dashboard/data/dashboardMockData.ts`

**Changes**: Keep only if intentionally needed for tests/story-like usage; otherwise remove and clean imports.

```ts
// Remove file if unused, or move to test-only fixtures.
```

**Why**: Prevents accidental reversion to client-local data source.

#### 2. Add contract notes for reusable API endpoints

**File**: `README.md` (or `docs/api-guidelines.md` addendum)

**Changes**: Document endpoint list, response slices, and “mocked in handler for now” note.

```md
### Reusable Home Data APIs (mocked backend data)
- GET /api/summary
- GET /api/rooms
- GET /api/tasks/upcoming
- GET /api/activity/recent
```

**Why**: Makes current contract discoverable and sets expectation for future persistence work.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Frontend lint passes: `npm run lint` (in `tidynest.client`)
- [x] Type check/build passes: `npm run build` (in `tidynest.client`)

#### Manual Verification

- [ ] No frontend code path imports dashboard mock data at runtime.
- [ ] API contract documentation matches implemented routes and field names.
- [ ] Dashboard still renders correctly on desktop and mobile widths.

**⏸️ PAUSE**: Wait for human verification before completion

---

## Testing Strategy

### Unit Tests

- [ ] `dashboardApi.ts` request helper: throws on non-2xx and parses JSON on success.
- [ ] `useDashboardData` state transitions: loading → success and loading → error.

### Integration Tests

- [ ] Backend endpoint contract checks for all new reusable `/api/*` resource routes.
- [ ] Frontend dashboard page renders expected section content from API responses.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Frontend/backend DTO drift | Keep `DashboardData` as authoritative frontend shape and mirror explicitly in C# DTOs; verify fields in manual API checks. |
| Multiple endpoint partial failure causes blank page | Preserve hook error handling and expose clear failure message; later enhancement can add partial rendering fallback. |
| Local dev API calls fail due to proxy mismatch | Add explicit `^/api` Vite proxy rule and verify with running server. |

## References

- Existing plan context: `.opencode/thoughts/plans/2026-03-07-cozy-home-dashboard.md`
- API conventions: `docs/api-guidelines.md`
- Architecture guidance: `docs/architecture.md`
- Coding standards: `docs/coding-standards.md`
