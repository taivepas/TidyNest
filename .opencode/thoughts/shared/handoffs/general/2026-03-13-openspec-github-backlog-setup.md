---
date: 2026-03-13T00:00:00Z
author: opencode
type: handoff
topic: GitHub MCP token wiring, backlog bootstrap, and OpenSpec setup
status: complete
---

# Context Saved: GitHub + OpenSpec Bootstrap

## What was completed

- Added local secret handling:
  - `.env.local` created for `GITHUB_PERSONAL_ACCESS_TOKEN` (ignored by git)
  - `.env.example` created as safe template
  - `.gitignore` updated to ignore `.env.local`
- Wired OpenCode GitHub MCP launch in `opencode.jsonc` via dotenv:
  - `npx -y dotenv-cli -e .env.local -- npx -y @modelcontextprotocol/server-github`
- Verified MCP server process starts (`running on stdio`).
- Created initial GitHub backlog issues in `taivepas/TidyNest`:
  - #1 MVP: Task CRUD
  - #2 MVP: Due dates and recurrence basics
  - #3 MVP: Task status filters
  - #4 MVP: Dashboard summary (today/this week)
  - #5 UX: Loading/empty/error states
  - #6 Engineering: Quality gates
- Installed and initialized OpenSpec in repo:
  - `npx -y @fission-ai/openspec@latest init`
  - OpenSpec commands/skills scaffolding generated under `.opencode` and `.github`.

## Commits pushed

- `8049d2f` chore: configure github mcp with local env token
- `4a88b7d` chore: initialize openspec workflow scaffolding

## Important notes

- A GitHub token was shared in chat during setup. It should be rotated/revoked and replaced in `.env.local`.
- MCP tool-based GitHub issue creation returned `Requires authentication` in-session, but direct GitHub API calls with the token succeeded.
- `gh` CLI is not installed in this environment (`gh: command not found`).

## Next likely actions after restart

- Use OpenSpec workflow commands:
  - `/opsx:propose "..."`
  - `/opsx:apply`
  - `/opsx:archive`
- Optionally add GitHub labels and apply them to issues #1-#6.
