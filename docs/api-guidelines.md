# TidyNest API Guidelines

## Endpoint Style

- Use resource-based routes under `/api`
- Prefer nouns over verbs in paths
- Use HTTP methods semantically (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`)

## Request and Response Contracts

- Use request/response DTOs for all endpoints
- Keep contracts explicit and stable
- Include server-generated identifiers and timestamps where useful

## Validation

- Validate all external input
- Return `400` for invalid payloads with structured error details
- Use `404` for missing resources, `409` for conflicts when applicable

## Error Format

- Use a consistent JSON error shape
- Include machine-readable code and human-readable message
- Avoid leaking internal stack traces to clients

## Versioning and Compatibility

- Avoid breaking response shapes without migration plan
- Introduce versioning when breaking changes become necessary
- Document behavioral contract changes in changelog/docs

## Performance and Reliability

- Keep endpoints predictable in latency for common paths
- Avoid N+1 style data access patterns as domain grows
- Add cancellation support for long-running operations

## Security Basics

- Never trust client input
- Enforce authorization checks at endpoint/service layer
- Keep secrets out of code and logs
