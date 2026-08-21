# Contributing

Contributions are welcome.

This project is intended to remain a clean, reusable API foundation. Changes should improve the template itself rather than introduce application-specific assumptions.

## Before Contributing

Before opening a pull request:

* Read the project README.
* Check existing issues and pull requests.
* Avoid duplicating existing functionality.
* Keep changes focused.
* Make sure the project builds successfully.
* Run the available checks locally.

## Development Setup

Install dependencies:

```bash
pnpm install
```

Start development mode:

```bash
pnpm dev
```

Build the project:

```bash
pnpm build
```

Run the available tests and static checks:

```bash
pnpm test
pnpm lint
pnpm typecheck
```

If a script does not exist in the current project version, do not add a fake replacement. Update this document when the project scripts change.

## Project Structure

Follow the existing architecture.

Middleware belongs in:

```text
src/middleware/
```

Infrastructure and application lifecycle code belongs in the appropriate core/infrastructure modules.

Routes belong in:

```text
src/routes/
```

Shared types belong in:

```text
src/types/
```

Do not place unrelated application logic inside middleware, route loaders or the application bootstrap.

## Routes

Routes should follow the automatic route discovery convention.

Example:

```text
src/routes/v1/users.ts
```

represents:

```text
/v1/users
```

Keep all methods belonging to the same resource in the same route file unless there is a strong architectural reason not to.

## TypeScript

Type safety is mandatory.

Do not introduce:

```ts
any
```

to bypass TypeScript errors.

Prefer:

* explicit interfaces
* type aliases
* type guards
* generics
* `unknown` with proper narrowing

If a type is difficult to express, solve the type problem rather than disabling the compiler.

## Error Handling

Do not implement ad-hoc error responses throughout the application.

Errors should flow through the centralized error handling system.

Do not expose:

* stack traces
* internal filesystem paths
* database errors
* secrets
* credentials
* internal implementation details

to API clients.

## Middleware

Middleware should have one responsibility.

Avoid creating large middleware files that handle unrelated concerns.

For example:

```text
cors.ts
headers.ts
rateLimit.ts
requestId.ts
httpLogger.ts
compression.ts
errorHandler.ts
```

is preferable to a single middleware containing everything.

## Security

Security-related changes require additional scrutiny.

Do not:

* commit credentials
* commit API keys
* disable security middleware without justification
* weaken validation to make a test pass
* expose sensitive information through logs
* silently bypass rate limiting
* trust client-provided authorization information

See [`SECURITY.md`](SECURITY.md).

## Commits

Keep commits small and focused.

Good:

```text
feat: add request validation
fix: handle oversized request bodies
refactor: simplify route loader
docs: update security guidelines
```

Avoid commits such as:

```text
stuff
changes
fix
update everything
```

A commit should describe what changed and why when the reason is not obvious.

## Pull Requests

A pull request should:

* Have a clear title.
* Explain what changed.
* Explain why the change is necessary.
* Include relevant tests or verification steps.
* Avoid unrelated changes.
* Preserve the existing architecture unless the PR explicitly changes it.

For larger architectural changes, explain the trade-offs before implementation.

## Adding Dependencies

Do not add a dependency for trivial functionality that can be implemented safely with Node.js or existing dependencies.

When adding a dependency, consider:

* maintenance status
* security history
* bundle/runtime impact
* TypeScript support
* compatibility with the current Fastify version
* whether the functionality is actually necessary

## Breaking Changes

Breaking architectural or API changes must be clearly identified.

Examples include:

* changing route conventions
* changing response formats
* removing middleware
* changing configuration names
* changing authentication contracts
* changing the public API

## Code Review

Reviewers should prioritize:

1. Correctness
2. Security
3. Type safety
4. API compatibility
5. Error handling
6. Maintainability
7. Performance

Do not approve code simply because it works locally.

## Final Principle

The template should remain boring.

If a feature makes the foundation significantly more complicated without providing a clear benefit to applications built on top of it, it probably does not belong in the base.
