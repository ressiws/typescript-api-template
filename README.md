# TypeScript Web Server Template

A production-oriented Web Server template built with **TypeScript** and **Fastify**.

The template provides a structured foundation for building Web Servers without forcing application-specific business logic into the base.

## Features

* TypeScript
* Fastify
* Automatic route discovery
* Versioned Web Server routes
* Modular middleware architecture
* CORS configuration
* Security headers with Helmet
* Rate limiting
* Request IDs
* HTTP request logging
* Response compression
* Centralized error handling
* Request body size limits
* Native Fastify request validation
* Swagger / OpenAPI documentation
* Graceful application lifecycle
* Environment-based configuration
* Structured logging
* Sensitive data redaction

## Requirements

* Node.js 20+
* npm or pnpm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create the environment configuration:

```bash
cp .env.example .env
```

Start the development server:

```bash
pnpm dev
```

Build the application:

```bash
pnpm build
```

Start the production build:

```bash
pnpm start
```

## Project Structure

```text
src/
├── config/
│   └── ...
├── core/
│   ├── bootstrapper.ts
│   ├── httpServer.ts
│   └── shutdown.ts
├── loaders/
│   └── routeLoader.ts
├── logging/
│   └── logger.ts
├── middleware/
│   ├── compression.ts
│   ├── cors.ts
│   ├── errorHandler.ts
│   ├── headers.ts
│   ├── httpLogger.ts
│   ├── rateLimit.ts
│   └── requestId.ts
├── routes/
│   └── v1/
│       └── health.ts
├── routing/
│   └── router.ts
├── types/
│   └── ...
├── utils/
│   └── ...
├── app.ts
└── index.ts
```

The exact structure may evolve as the template grows.

## Routes

Routes are automatically discovered from the `routes/` directory.

For example:

```text
src/routes/v1/health.ts
```

becomes:

```text
GET /v1/health
```

A route file contains all HTTP methods belonging to that resource.

```ts
router.get("/", async () => {
	return {
		status: "ok",
	};
});

router.post("/", async () => {
	// ...
});
```

The route path is derived from the file location rather than being manually registered in the application.

### Route Parameters

A route can define parameters using the router convention:

```text
src/routes/v1/users/[id].ts
```

becomes:

```text
/v1/users/:id
```

Nested route directories are supported.

## Server Versioning

Server versions are represented by directories:

```text
routes/
└── v1/
    ├── health.ts
    ├── users.ts
    └── auth.ts
```

This produces:

```text
/v1/health
/v1/users
/v1/auth
```

Future versions can coexist:

```text
routes/
├── v1/
└── v2/
```

## Configuration

Configuration is loaded from environment variables.

Secrets and environment-specific values must never be committed to the repository.

Use `.env.example` as the reference for required configuration.

## Security

Security middleware is enabled centrally rather than implemented individually in every route.

The base includes:

* HTTP security headers
* CORS
* Rate limiting
* Request ID tracking
* Request body limits
* Centralized error handling
* Sensitive log redaction
* Request validation

Application-specific authentication and authorization should be added according to the requirements of the application using this template.

See [`SECURITY.md`](SECURITY.md) for security policies and vulnerability reporting.

## Web Server Documentation

OpenAPI / Swagger documentation is available during development at:

```text
/docs
```

The documentation should be generated from the Web Server schemas rather than manually maintained whenever possible.

## Logging

Logs are structured and categorized.

Example:

```text
[HTTP] INFO | Request completed
```

Sensitive values such as passwords, tokens, Web Server keys and authorization headers are redacted automatically.

Development logs are formatted for readability, while production logging remains machine-readable.

## Development Principles

This template follows a few strict principles:

1. Keep infrastructure separate from application logic.
2. Keep middleware modular.
3. Avoid global mutable state where possible.
4. Validate external input.
5. Never trust client-provided data.
6. Never expose internal errors to clients.
7. Never log secrets.
8. Keep routes small and focused.
9. Prefer explicit types over `any`.
10. Keep framework-specific code isolated where practical.