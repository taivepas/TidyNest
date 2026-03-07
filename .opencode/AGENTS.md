# TidyNest Project Agent Guide

## Project Stack
- Backend: ASP.NET Core (`TidyNest.Server`, .NET 10)
- Frontend: React + TypeScript + Vite (`tidynest.client`)

## Working Style
- Make small, focused changes in vertical slices (API + UI together when possible).
- Prefer clear names and straightforward code over clever abstractions.
- Keep existing project structure and conventions unless there is a clear reason to change.

## Quality Gates
- For backend changes, run: `dotnet build TidyNest.slnx`
- For frontend changes, run in `tidynest.client`: `npm run build` and `npm run lint`
- For full app smoke check, run: `dotnet run --project TidyNest.Server`

## API and UI Conventions
- Use DTOs for API contracts.
- Validate request input at API boundaries.
- Keep API routes consistent and resource-oriented.
- In React, keep components small and move shared logic into hooks/utilities when repeated.

## Git Practices
- Branch from `main` using `feature/<short-name>`.
- Use Conventional Commit style (`feat:`, `fix:`, `chore:`, `refactor:`).
- Do not commit generated artifacts or secrets.

## Security and Config
- Do not hardcode secrets.
- Keep environment-specific values in configuration files or environment variables.

## Definition of Done
- Code builds and lint passes for affected parts.
- New behavior is manually verified.
- Any non-obvious decisions are documented in README or a short note in PR description.
