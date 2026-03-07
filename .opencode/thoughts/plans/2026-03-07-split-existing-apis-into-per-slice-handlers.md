---
date: "2026-03-07T14:35:00Z"
author: opencode
type: plan
topic: "Split existing APIs into per-slice minimal API handlers"
status: draft
git_commit: "7438ea5a15f635f025799d0feeb5d3dde59e2c5c"
git_branch: "main"
related_research: ".opencode/thoughts/plans/2026-03-07-ui-data-from-reusable-backend-apis.md"
last_updated: "2026-03-07T14:35:00Z"
last_updated_by: opencode
last_updated_note: "Updated handler signature decision to Task<IResult> across all endpoint slices"
---

# Split Existing APIs into Per-Slice Handler Files (Vertical Slice)

## Overview

We will refactor the current four backend minimal APIs so each API endpoint has its own handler file under the same feature slice. This keeps routes and response contracts unchanged while enforcing a vertical-slice structure where endpoint behavior is isolated per file.

## Current State Analysis

- All four current APIs are mapped in one file: `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:9-30`.
- Endpoint implementations are inline lambdas in route registration rather than dedicated handler files.
- DTO contracts are already separated and reusable in `TidyNest.Server/Features/HomeData/HomeDataContracts.cs:3-27`.
- Startup wiring is already clean and feature-based: `TidyNest.Server/Program.cs:22` calls `app.MapHomeData()`.
- README already documents current endpoint contracts under reusable `/api/*` resources.

## Desired End State

Each existing API endpoint (`/api/summary`, `/api/rooms`, `/api/tasks/upcoming`, `/api/activity/recent`) is mapped to a dedicated handler file in the HomeData feature slice. Route paths, response payload shape, and frontend behavior remain unchanged.

### Key Discoveries

- Existing architecture already follows feature slicing (`Features/HomeData`), so this is a structural refinement, not a route redesign.
- Contract values were recently normalized to frontend enums; this must be preserved during refactor.
- Frontend now depends on these routes directly, so route stability is critical.

## What We're NOT Doing

- No route path changes.
- No payload shape changes.
- No persistence/database changes.
- No auth/authorization changes.
- No frontend code changes except if strictly needed for compilation (not expected).

## Implementation Approach

Keep `MapHomeDataEndpoints.cs` as route registration only, and move each endpoint handler implementation into its own file under a new `Handlers` folder in the same vertical slice. Each handler exposes a static async `Handle` method returning `Task<IResult>` and used directly in `group.MapGet(...)`.

---

## Phase 1: Create Per-Endpoint Handler Files

### Overview

Introduce one handler file per existing API while preserving current mocked payloads and enum-compatible values.

### Changes Required

#### 1. Add summary endpoint handler

**File**: `TidyNest.Server/Features/HomeData/Handlers/GetSummaryHandler.cs` (new)

**Changes**: Create a static handler returning existing summary payload.

```csharp
namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetSummaryHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new DashboardSummaryResponse(7, 3, 2, 64)));
}
```

**Why**: Splits endpoint behavior into dedicated slice file.

#### 2. Add rooms endpoint handler

**File**: `TidyNest.Server/Features/HomeData/Handlers/GetRoomsHandler.cs` (new)

**Changes**: Move room payload to dedicated handler and preserve status values.

```csharp
namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetRoomsHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new[]
        {
            new RoomStatusResponse("kitchen", "Kitchen", "needs_tidy", "2026-03-05T18:30:00Z"),
            new RoomStatusResponse("living-room", "Living Room", "clean", "2026-03-06T09:15:00Z"),
            new RoomStatusResponse("bathroom", "Bathroom", "deep_clean", "2026-03-04T20:45:00Z"),
        }));
}
```

**Why**: Isolates route behavior and keeps contract-safe enum values.

#### 3. Add upcoming tasks endpoint handler

**File**: `TidyNest.Server/Features/HomeData/Handlers/GetUpcomingTasksHandler.cs` (new)

**Changes**: Move upcoming tasks payload into handler file.

```csharp
namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetUpcomingTasksHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new[]
        {
            new UpcomingTaskResponse("task-1", "Vacuum living room", "2026-03-07T17:00:00Z", "living-room", true),
            new UpcomingTaskResponse("task-2", "Clean kitchen counters", "2026-03-07T19:30:00Z", "kitchen", false),
            new UpcomingTaskResponse("task-3", "Bathroom deep clean", "2026-03-08T10:00:00Z", "bathroom", true),
        }));
}
```

**Why**: Enforces per-API file separation.

#### 4. Add recent activity endpoint handler

**File**: `TidyNest.Server/Features/HomeData/Handlers/GetRecentActivityHandler.cs` (new)

**Changes**: Move recent activity payload into dedicated handler file and preserve activity types.

```csharp
namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetRecentActivityHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new[]
        {
            new ActivityItemResponse("activity-1", "task_completed", "2026-03-07T08:15:00Z", "Dishes were done", "Alex"),
            new ActivityItemResponse("activity-2", "task_completed", "2026-03-06T21:05:00Z", "Laundry folded", "Jamie"),
            new ActivityItemResponse("activity-3", "task_added", "2026-03-06T19:45:00Z", "Added weekly plant watering", "Alex"),
        }));
}
```

**Why**: Keeps each API in its own vertical-slice file as requested.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Tests pass: `dotnet test TidyNest.slnx`
- [x] No frontend compile regression: `npm run build` (in `tidynest.client`)

#### Manual Verification

- [ ] New handler files exist and each maps to exactly one API endpoint.
- [ ] Mock payload values match previous responses.

**⏸️ PAUSE**: Wait for human verification before Phase 2

---

## Phase 2: Convert Map File to Registration-Only Composition

### Overview

Refactor route mapping to use the new handler files, turning endpoint map file into clean registration glue.

### Changes Required

#### 1. Update endpoint map file to call handlers

**File**: `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs`

**Changes**: Remove inline payload construction and map each route to its dedicated `Handle` method.

```csharp
using TidyNest.Server.Features.HomeData.Handlers;

namespace TidyNest.Server.Features.HomeData;

public static class MapHomeDataEndpoints
{
    public static IEndpointRouteBuilder MapHomeData(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/summary", GetSummaryHandler.Handle);
        group.MapGet("/rooms", GetRoomsHandler.Handle);
        group.MapGet("/tasks/upcoming", GetUpcomingTasksHandler.Handle);
        group.MapGet("/activity/recent", GetRecentActivityHandler.Handle);

        return app;
    }
}
```

**Why**: Keeps routing centralized while maintaining one-handler-per-API implementation.

#### 2. Keep startup wiring unchanged

**File**: `TidyNest.Server/Program.cs`

**Changes**: No functional change expected; verify `app.MapHomeData()` remains before fallback.

```csharp
app.MapHomeData();
app.MapFallbackToFile("/index.html");
```

**Why**: Preserve stable startup behavior while refactoring internals.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Tests pass: `dotnet test TidyNest.slnx`
- [x] Frontend lint passes: `npm run lint` (in `tidynest.client`)
- [x] Frontend build passes: `npm run build` (in `tidynest.client`)

#### Manual Verification

- [ ] All four routes still return 200 and unchanged JSON shape.
- [ ] Frontend dashboard loads correctly from APIs without code changes.

**⏸️ PAUSE**: Wait for human verification before Phase 3

---

## Phase 3: Minimal Documentation Update for Handler-Slice Structure

### Overview

Document the per-API handler slice convention for current endpoints to make maintenance predictable.

### Changes Required

#### 1. Update README backend API section with handler structure note

**File**: `README.md`

**Changes**: Add a short note that each existing API endpoint has a dedicated handler file under `Features/HomeData/Handlers`.

```md
Implementation note:
- Each `/api/*` endpoint is implemented as a dedicated handler file under `TidyNest.Server/Features/HomeData/Handlers/`.
```

**Why**: Makes the architecture explicit for future contributors.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`

#### Manual Verification

- [ ] README reflects route list and handler-slice location accurately.
- [ ] No contradiction between docs and code structure.

**⏸️ PAUSE**: Wait for human verification before completion

---

## Testing Strategy

### Unit Tests

- [ ] Add future test per handler `Handle()` method return shape when test project is introduced.

### Integration Tests

- [ ] Verify `GET /api/summary`, `/api/rooms`, `/api/tasks/upcoming`, `/api/activity/recent` response contract consistency.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Accidental route or payload drift during extraction | Keep route paths unchanged and move payload literals verbatim into handlers; verify with API smoke checks. |
| Enum-like value mismatch with frontend contracts | Preserve `needs_tidy/clean/deep_clean` and `task_completed/task_added/note` values exactly in handler payloads. |
| Over-refactor beyond scope | Restrict changes to current 4 APIs and HomeData feature only. |

## References

- Plan baseline: `.opencode/thoughts/plans/2026-03-07-ui-data-from-reusable-backend-apis.md`
- Handoff context: `.opencode/thoughts/shared/handoffs/general/2026-03-07-reusable-home-data-apis-handoff.md`
- API guidelines: `docs/api-guidelines.md`
- Coding standards: `docs/coding-standards.md`
