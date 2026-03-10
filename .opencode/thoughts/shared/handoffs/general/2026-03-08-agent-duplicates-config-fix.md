---
date: 2026-03-08T00:00:00Z
author: opencode
type: handoff
topic: Agent picker duplicate entries due to mixed-case IDs
status: complete
---

# Context Saved: Agent Duplicate Entries

## Problem

The OpenCode agent picker showed duplicate entries for planning/research/implementation agents.

## Cause

Agent IDs were defined in two places with different names:

- Project config used `Dev/Plan`, `Dev/Research`, `Dev/Implement`.
- Global agent definitions use canonical lowercase IDs: `dev/plan`, `dev/research`, `dev/implement`.

Because IDs did not match exactly, OpenCode listed both sets.

## Fix Applied

Updated project file `opencode.jsonc` to use canonical IDs:

- `Dev/Plan` -> `dev/plan`
- `Dev/Research` -> `dev/research`
- `Dev/Implement` -> `dev/implement`

## Notes for Future Sessions

- If duplicates appear again, check for agent ID case/path mismatches between project and global configs.
- Reload/restart OpenCode after config changes so the picker refreshes.
