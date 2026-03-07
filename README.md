# TidyNest

TidyNest is a home-task management app built with ASP.NET Core and React.

## Tech Stack

- Backend: ASP.NET Core (`TidyNest.Server`, .NET 10)
- Frontend: React + TypeScript + Vite (`tidynest.client`)

## Repository Structure

- `TidyNest.Server/` - API and static hosting setup
- `tidynest.client/` - React application
- `.opencode/` - project agent context and RPI thought artifacts
- `docs/` - product, architecture, standards, and workflow docs

## Getting Started

### Prerequisites

- .NET SDK 10
- Node.js 20+
- npm

### Install Dependencies

Frontend dependencies are already tracked in `tidynest.client/package-lock.json`.

```bash
cd tidynest.client
npm install
```

### Run the App (Full Stack)

From repository root:

```bash
dotnet run --project TidyNest.Server
```

This runs the ASP.NET backend and uses SPA proxy to launch the Vite dev server.

### Frontend-Only Commands

Run from `tidynest.client/`:

```bash
npm run dev
npm run lint
npm run build
```

### Backend Build Check

From repository root:

```bash
dotnet build TidyNest.slnx
```

### Reusable Home Data APIs (mocked backend data)

Backend endpoints currently return mocked JSON responses directly from server handlers:

- GET /api/summary
- GET /api/rooms
- GET /api/tasks/upcoming
- GET /api/activity/recent

These contracts are intended to remain stable as we later swap in real persistence-backed data sources.

Implementation note:
- Each `/api/*` endpoint is implemented as a dedicated handler file under `TidyNest.Server/Features/HomeData/Handlers/`.

## RPI Workflow (OpenCode)

Primary command flow:

1. `/research <topic>`
2. `/plan <feature>`
3. `/implement <plan-path>`

Supporting commands:

- `/iterate <plan-path> <feedback>`
- `/validate <plan-path>`
- `/handoff [ticket] [description]`
- `/resume [ticket|path]`

RPI artifacts are stored under:

- `.opencode/thoughts/research/`
- `.opencode/thoughts/plans/`
- `.opencode/thoughts/shared/handoffs/`

## Project Documentation

- `docs/product.md`
- `docs/architecture.md`
- `docs/coding-standards.md`
- `docs/api-guidelines.md`
- `docs/ui-guidelines.md`
- `docs/rpi-workflow.md`
- `docs/feature-template.md`

## Development Conventions

- Use small vertical slices (API + UI when practical)
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`)
- Run build/lint checks before committing
