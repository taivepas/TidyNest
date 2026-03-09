---
date: "2026-03-08T00:00:00Z"
author: opencode
type: plan
topic: "Connect backend handlers to (localdb)\\MSSQLLocalDB using EF Core and auto-create DB on startup"
status: draft
git_commit: "cf17b11ba9b3a64d7b0d51ff56b364a23ee686ca"
git_branch: "main"
related_research: ".opencode/thoughts/plans/2026-03-07-ui-data-from-reusable-backend-apis.md"
last_updated: "2026-03-08T00:00:00Z"
last_updated_by: opencode
---

# EF Core LocalDB Connectivity for HomeData Handlers Implementation Plan

## Overview

We will replace hardcoded HomeData API responses with EF Core-backed queries using SQL Server LocalDB (`(localdb)\\MSSQLLocalDB`). On app startup, we will apply migrations and seed initial data (based on current mock payloads) so the API returns meaningful data immediately.

## Current State Analysis

- Startup currently registers only OpenAPI and endpoint mapping in `TidyNest.Server/Program.cs:3-26`.
- HomeData endpoints are mapped under `/api` in `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs:7-14`.
- All handlers return static, in-memory data in:
  - `TidyNest.Server/Features/HomeData/Handlers/GetSummaryHandler.cs:7-8`
  - `TidyNest.Server/Features/HomeData/Handlers/GetRoomsHandler.cs:7-13`
  - `TidyNest.Server/Features/HomeData/Handlers/GetUpcomingTasksHandler.cs:7-13`
  - `TidyNest.Server/Features/HomeData/Handlers/GetRecentActivityHandler.cs:7-13`
- API contracts (DTOs) are record types in `TidyNest.Server/Features/HomeData/HomeDataContracts.cs:3-27` and currently use string IDs/timestamps.
- No EF Core packages, DbContext, entities, or connection strings exist yet (`TidyNest.Server/TidyNest.Server.csproj:12-17`, `TidyNest.Server/appsettings.Development.json:1-8`).

## Desired End State

Success means:
- Backend uses EF Core SQL Server provider with LocalDB connection from configuration.
- Startup runs migrations automatically (`Database.MigrateAsync`) and seeds initial HomeData data only when empty.
- `/api/summary`, `/api/rooms`, `/api/tasks/upcoming`, `/api/activity/recent` return data from database, preserving existing response shapes.
- Project builds successfully and endpoint behavior is manually validated against expected seeded values.

### Key Discoveries

- Existing architecture favors vertical slices and static minimal API handlers; we should keep route mapping unchanged.
- Prior plans explicitly kept persistence out of scope; this request intentionally lifts that constraint.
- Route and DTO contract stability is important for current frontend compatibility.

## What We're NOT Doing

- No auth/authorization changes.
- No frontend contract changes (route paths and JSON field names stay the same).
- No broad domain redesign beyond what is needed to persist current HomeData.
- No production SQL deployment changes; this plan targets LocalDB dev flow first.

## Implementation Approach

Introduce a small persistence layer (`Data` + EF entities + DbContext), wire it in `Program.cs`, then refactor handlers to query EF while mapping to existing DTOs. Use migration-based initialization plus idempotent seeding to satisfy “create DB if missing” and keep startup deterministic.

---

## Phase 1: Add EF Core Persistence Foundation

### Overview

Create EF infrastructure and LocalDB configuration without changing endpoint behavior yet.

### Changes Required

#### 1. Add EF Core packages

**File**: `TidyNest.Server/TidyNest.Server.csproj`

**Changes**: Add SQL Server and design-time EF packages.

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.3" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.3">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
</ItemGroup>
```

**Why**: Required for DbContext, SQL Server provider, and migrations.

#### 2. Add LocalDB connection string

**File**: `TidyNest.Server/appsettings.Development.json`

**Changes**: Add `ConnectionStrings.DefaultConnection` for `(localdb)\\MSSQLLocalDB`.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TidyNestDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**Why**: Keeps DB configuration external and environment-specific.

#### 3. Create DbContext + entities

**File**: `TidyNest.Server/Data/TidyNestDbContext.cs`

**Changes**: Add DbContext and DbSet properties for rooms, tasks, and activity.

```csharp
public sealed class TidyNestDbContext(DbContextOptions<TidyNestDbContext> options) : DbContext(options)
{
    public DbSet<RoomEntity> Rooms => Set<RoomEntity>();
    public DbSet<HouseTaskEntity> Tasks => Set<HouseTaskEntity>();
    public DbSet<ActivityEntity> ActivityItems => Set<ActivityEntity>();
}
```

**Why**: Defines persistence model and query surface for handlers.

#### 4. Add initial migration

**File**: `TidyNest.Server/Migrations/*`

**Changes**: Create initial migration for HomeData schema.

```bash
dotnet ef migrations add InitialHomeData --project TidyNest.Server
```

**Why**: Enables migration-based DB creation via startup `MigrateAsync`.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Migration compiles: `dotnet ef migrations list --project TidyNest.Server`

#### Manual Verification

- [x] Confirm LocalDB instance is reachable.
- [x] Confirm migration files are generated under `TidyNest.Server/Migrations`.

**⏸️ PAUSE**: Wait for human verification before Phase 2

---

## Phase 2: Startup Migration and Seed Initialization

### Overview

Ensure DB is created automatically on startup (via migrations) and seeded with current mock data when empty.

### Changes Required

#### 1. Register DbContext in startup

**File**: `TidyNest.Server/Program.cs`

**Changes**: Register DbContext before `builder.Build()`.

```csharp
builder.Services.AddDbContext<TidyNestDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Why**: Enables DI-based DB access in minimal API handlers.

#### 2. Apply migrations on app startup

**File**: `TidyNest.Server/Program.cs`

**Changes**: Create scoped startup block that runs `MigrateAsync()`.

```csharp
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<TidyNestDbContext>();
await db.Database.MigrateAsync();
```

**Why**: Creates database if missing and applies schema updates safely.

#### 3. Seed initial data from current mock payloads

**File**: `TidyNest.Server/Data/Seed/HomeDataSeeder.cs`

**Changes**: Add idempotent seeder that inserts room/task/activity rows equivalent to removed hardcoded mock data.

```csharp
if (!await db.Rooms.AnyAsync())
{
    db.Rooms.AddRange(new RoomEntity { Id = "kitchen", Name = "Kitchen", Status = "needs_tidy", LastCleanedAt = DateTimeOffset.Parse("2026-03-05T18:30:00Z") });
    // ...other mock-derived records
    await db.SaveChangesAsync();
}
```

**Why**: Keeps first-run UX and API responses consistent after removing hardcoded handler data.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] App starts and migrates DB: `dotnet run --project TidyNest.Server`

#### Manual Verification

- [ ] Delete `TidyNestDb` (if present), restart app, verify DB is recreated automatically.
- [x] Inspect database tables and confirm seed rows exist.

**⏸️ PAUSE**: Wait for human verification before Phase 3

---

## Phase 3: Refactor HomeData Handlers to EF Queries

### Overview

Replace hardcoded responses in all HomeData handlers with EF-backed queries while preserving existing DTO contracts.

### Changes Required

#### 1. Inject DbContext into handlers

**Files**:
- `TidyNest.Server/Features/HomeData/Handlers/GetSummaryHandler.cs`
- `TidyNest.Server/Features/HomeData/Handlers/GetRoomsHandler.cs`
- `TidyNest.Server/Features/HomeData/Handlers/GetUpcomingTasksHandler.cs`
- `TidyNest.Server/Features/HomeData/Handlers/GetRecentActivityHandler.cs`

**Changes**: Update handler signatures to accept `TidyNestDbContext` and query async.

```csharp
public static async Task<IResult> Handle(TidyNestDbContext db)
{
    var rooms = await db.Rooms.AsNoTracking().ToListAsync();
    var response = rooms.Select(r => new RoomStatusResponse(r.Id, r.Name, r.Status, r.LastCleanedAt.ToString("O")));
    return Results.Ok(response);
}
```

**Why**: Connects all endpoints to LocalDB persistence using minimal API DI.

#### 2. Compute summary from persisted data

**File**: `TidyNest.Server/Features/HomeData/Handlers/GetSummaryHandler.cs`

**Changes**: Calculate today totals, completed count, rooms needing attention, and weekly progress from task/room data.

```csharp
var todayTasksTotal = await db.Tasks.CountAsync(t => t.DueAtUtc.Date == now.Date);
var todayTasksCompleted = await db.Tasks.CountAsync(t => t.DueAtUtc.Date == now.Date && t.IsCompleted);
```

**Why**: Removes hardcoded summary values and keeps logic data-driven.

#### 3. Keep route and DTO contracts unchanged

**Files**:
- `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs`
- `TidyNest.Server/Features/HomeData/HomeDataContracts.cs`

**Changes**: No route path changes; preserve DTO property names/types.

```csharp
group.MapGet("/summary", GetSummaryHandler.Handle);
```

**Why**: Prevents frontend breakage.

### Success Criteria

#### Automated Verification

- [x] Build passes: `dotnet build TidyNest.slnx`
- [x] Backend starts cleanly: `dotnet run --project TidyNest.Server`

#### Manual Verification

- [x] `GET /api/summary` returns non-hardcoded values derived from DB.
- [x] `GET /api/rooms` returns seeded rooms from DB.
- [x] `GET /api/tasks/upcoming` returns seeded tasks from DB.
- [x] `GET /api/activity/recent` returns seeded activity from DB.
- [x] Restarting app does not duplicate seed rows.

**⏸️ PAUSE**: Wait for human verification before any follow-up refactors

---

## Testing Strategy

### Unit Tests

- [ ] Seeder idempotency test: running seed twice does not duplicate data.
- [ ] Summary computation test: percentages and counts are computed correctly from task rows.

### Integration Tests

- [ ] Startup migration test: app initializes schema from empty LocalDB.
- [ ] Endpoint contract test: HomeData endpoints still match expected JSON shape.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| LocalDB unavailable on some machines | Keep connection string in `appsettings.Development.json` and document LocalDB prerequisite; fail with clear startup error. |
| Seed data duplication on restart | Make seeder idempotent (`AnyAsync` checks + deterministic keys). |
| Frontend break due to contract drift | Preserve DTOs/routes as-is; add contract-focused integration checks. |
| Migration startup failure blocks app | Log migration errors clearly and validate migration list in CI/local before merge. |

## References

- Related context: `.opencode/thoughts/plans/2026-03-07-ui-data-from-reusable-backend-apis.md`
- API route wiring: `TidyNest.Server/Features/HomeData/MapHomeDataEndpoints.cs`
- Current startup: `TidyNest.Server/Program.cs`
