# TidyNest Architecture

## Stack

- Backend: ASP.NET Core (`TidyNest.Server`, .NET 10)
- Frontend: React + TypeScript + Vite (`tidynest.client`)
- Hosting model: Single web app serving API + SPA static assets

## Current Structure

- `TidyNest.Server/Program.cs`: API setup, OpenAPI in development, EF Core registration, migration + seed on startup, static file hosting
- `TidyNest.Server/Features/`: backend features organized as vertical slices
- `TidyNest.Server/Data/`: EF Core DbContext, entities, seed logic, migrations
- `tidynest.client/`: Vite React app
- `TidyNest.slnx`: solution entry point

## Runtime Model

- In development, backend and Vite dev server run together via SPA proxy
- In production-style builds, backend serves compiled frontend assets

## API Design Direction

- Resource-oriented endpoints under `/api/*`
- DTO-based contracts between API and client
- Validation at request boundaries
- Consistent error response format

## Vertical Slices (Current Backend Approach)

Backend APIs are organized by feature slice instead of technical layers.

- Each slice groups route mapping, contracts, and handlers under `TidyNest.Server/Features/<FeatureName>/`
- Example: `Features/HomeData/`
  - `MapHomeDataEndpoints.cs`: maps slice endpoints under `/api`
  - `HomeDataContracts.cs`: DTO contracts for that slice
  - `Handlers/*.cs`: endpoint-specific handlers (one handler per endpoint)
- Handlers are thin endpoint units and use DI directly (for example `TidyNestDbContext`) for data access
- Slice boundaries are preferred for new backend work to keep changes focused and traceable

## Frontend Design Direction

- Feature-oriented folders under `src/`
- Reusable UI primitives plus page-level composition
- API client layer separated from UI components
- Keep components small and focused

## Data and State

- Persistence is now implemented with EF Core + SQL Server LocalDB in development
- `TidyNestDbContext` is the server-side source of truth for current HomeData APIs
- On startup, backend applies migrations automatically and seeds initial data when database is empty
- Current HomeData entities use integer identity primary keys
- API contracts for HomeData now return numeric IDs (`number` in frontend / `int` in backend DTOs)

## Cross-Cutting Concerns

- Logging and diagnostics around API boundaries
- Input validation and defensive defaults
- Versioned contract changes when breaking API behavior
- Keep EF migrations aligned with model changes and apply via startup migration flow

## Architectural Constraints

- Prefer incremental changes over large rewrites
- Preserve template wiring unless there is clear benefit
- Keep backend and frontend runnable independently for diagnostics
- Preserve vertical-slice organization when adding new features/endpoints
