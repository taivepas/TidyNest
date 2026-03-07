# TidyNest RPI Workflow

## Workflow Overview

Use a structured Research -> Plan -> Implement loop for non-trivial work.

1. Research the current state and constraints
2. Produce a phased plan with verification gates
3. Implement in small increments and validate

## Commands

- `/research <topic>`: produce research notes in `.opencode/thoughts/research/`
- `/plan <feature>`: produce implementation plan in `.opencode/thoughts/plans/`
- `/implement <plan-path>`: execute the approved plan phase by phase
- `/iterate <plan-path> <feedback>`: update existing plan surgically
- `/validate <plan-path>`: verify implementation against plan
- `/handoff [ticket] [description]`: create continuity document
- `/resume [ticket|path]`: resume from latest handoff/context

## Required Artifacts

- Research docs: `.opencode/thoughts/research/*.md`
- Plan docs: `.opencode/thoughts/plans/*.md`
- Handoffs: `.opencode/thoughts/shared/handoffs/**`

## Guardrails

- Research should describe what exists, not prescribe changes
- Plans must include explicit success criteria and verification commands
- Implementation should follow approved plan intent and pause at phase gates
- If reality diverges from plan, document and confirm before major deviation

## Suggested Team Rhythm

- Start medium/large tasks with `/research`
- Confirm plan quality before coding
- Keep implementations small enough for quick validation
- End interrupted sessions with `/handoff`
