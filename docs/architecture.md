# TidyNest Architecture

## Stack

- Backend: ASP.NET Core (`TidyNest.Server`, .NET 10)
- Frontend: React + TypeScript + Vite (`tidynest.client`)
- Hosting model: Single web app serving API + SPA static assets

## Current Structure

- `TidyNest.Server/Program.cs`: API setup, OpenAPI in development, static file hosting
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

## Frontend Design Direction

- Feature-oriented folders under `src/`
- Reusable UI primitives plus page-level composition
- API client layer separated from UI components
- Keep components small and focused

## Data and State (Near-Term)

- Start with in-memory or lightweight persistence while shaping domain
- Introduce persistence abstraction before database growth
- Keep state ownership explicit (server source of truth)

## Cross-Cutting Concerns

- Logging and diagnostics around API boundaries
- Input validation and defensive defaults
- Versioned contract changes when breaking API behavior

## Architectural Constraints

- Prefer incremental changes over large rewrites
- Preserve template wiring unless there is clear benefit
- Keep backend and frontend runnable independently for diagnostics
