# TidyNest Coding Standards

## General

- Favor readability over cleverness
- Keep functions small and single-purpose
- Use explicit, meaningful names
- Avoid dead code and commented-out blocks

## Backend (.NET)

- Use DTOs at API boundaries; avoid exposing internal models directly
- Validate input early and return clear error responses
- Use async APIs for I/O paths
- Keep endpoint handlers thin; move logic into services as complexity grows

## Frontend (React + TypeScript)

- Prefer functional components and hooks
- Keep components focused on one responsibility
- Use TypeScript types/interfaces for props, API payloads, and state
- Avoid large monolithic components; extract reusable pieces

## Error Handling

- Handle expected failures explicitly
- Do not swallow exceptions silently
- Return actionable messages for users and logs for developers

## Testing Expectations

- Add tests for non-trivial business logic
- For UI, prioritize behavior-focused tests over implementation details
- Ensure changed code paths are exercised before merging

## Formatting and Linting

- Run backend build checks before committing
- Run frontend lint and build checks before committing
- Keep formatting consistent with existing project conventions

## Git and Commits

- Use small, focused commits
- Follow Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `refactor:`)
- Commit messages should explain the intent, not only file changes
