![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)
![Build](https://github.com/ressiws/typescript-api-template/actions/workflows/ci.yml/badge.svg)

### typescript-api-template
**Version:** 1.0.0 \
**License:** MIT

# Table of Contents
- [Overview](#overview)
- [Why Use This Base?](#why-use-this-base)
- [Documentation](#documentation)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Initial Setup & Tokens](#initial-setup--tokens)
- [Middleware](#middleware)
- [Routes & Validation](#routes--validation)
- [Best Practices](#best-practices)
- [Response Format](#response-format)
- [Logging](#logging)
- [Token Management](#token-management)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## New here? Read this first

This project is **strict by design**.
If something feels “broken” (CORS, tokens, headers, validation), it is probably intentional.

👉 Read this before using or opening issues:
[`docs/why_is_api_strict.md`](docs/why_is_api_strict.md)

# Overview
typescript-api-template is a **robust and scalable API base** build with **Node.js**, **Typescript**, and **Express**.
Designed for production from day one, it includes:

- Token-based authentication with IP restrictions (`system` and `personal` tokens)
- Rate limiting per token or IP
- Global request validation with **Zod** schemas
- Structured logging and modular middleware
- Configurable CORS and payload protection
- Security headers for XSS, clickjacking, HSTS, CSP
- IP guard and JSON/payload protection against malformed or oversized requests
- Automatic token caching and refresh

This base is ideal for **internal tools, enterprise applications, or public APIs** requiring strict security and maintainability.

# Why Use This Base?
- **Production-ready**: best practices for security, validation, and logging.
- **Scalable**: Modular design allows easy extension with new routes and middleware.
- **Enterprise-grade**: Standardized responses, error codes, and global middlewares.
- **Safe & reliable**: Gracefully handles malformed JSON, large payloads, and invalid requests.
- **Easy configuration**: Everything controlled via environment variables.
> Start any Node.js/TypeScript project with security and maintainability out of the box.

# Documentation

For detailed internal docs, see:

- [Routes](./docs/routes.md) – Route structure and Zod validation
- [Security](security.md) – Security model, threat mitigation, logging
- [Architecture](./docs/architecture.md) – Project layout, middleware flow, token refresh
- [Configuration](./docs/configuration.md) – All environment variables and defaults

> [!NOTE]  
> Tokens require at least one allowed IP; there is no default fallback token.

# Features
| Feature | Description |
| ------- | ----------- |
| **Authentication** | Token-based, IP-bound, and with expiration checks. Configurable via `.env`. |
| **Rate Limiting** | Per-token/IP limits to prevent abuse. Fully configurable. |
| **Validation** | Automatic request validation using Zod for body, query, and params. |
| **Logging** | Detailed request and error logging with token context and duration. |
| **CORS** | Configurable allowed origins, methods, and credentials. |
| **Security Headers** | Helmet-powered headers including HSTS, frameguard, referrer policy, CSP |
| **IP Guard** | Limits requests per IP to prevent abuse and brute-force attacks. Configurable via `.env` |
| **JSON & Payload Protection** | Rejects malformed JSON, oversized requests (>10kb), and unexpected fields. Ensures server stability |
| **Hot Token Reload** | Tokens are refreshed every minute without server restart. |
| **Modular Design** | Routes, middleware, and services are separated for clarity and scalability. |

# Installation
### 1. Clone the Repository and Install Dependencies
```bash
git clone https://github.com/ressiws/typescript-api-template.git
cd typescript-api-template
pnpm install
cp .env.example .env # Copy the .env file and configure your environment variables
```

# Environment Variables
|  Variable  | Description | Default / Required |
| ---------- | ----------- | ------------------ |
| `NODE_ENV` | Environment mode (`development`, `production`) | Required |
| `APP_NAME` | Application name | Required |
| `APP_PORT` | Port number | Required |
| `APP_VERSION` | Application version | Required |
| `TRUST_PROXY` | Trust reverse proxy for `req.ip` (`true`/`false`) | false |
| `DB_HOST`  | Database host | Required |
| `DB_USER`  | Database username | Required |
| `DB_PASS`  | Database password | Required |
| `DB_NAME`  | Database name | Required |
| `AUTH_ENABLE` | Enable authentication middleware | true/false |
| `VALIDATE_ENABLE` | Enable request validation middleware (Zod) | true/false |
| `RATE_LIMIT_ENABLE` | Enable rate limiting | true/false |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 60000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 20 |
| `LOGGING_ENABLE` | Enable request/error logging | true/false |
| `CORS_ORIGIN` | Allowed origins (comma-separated). If empty or undefined, browser requests with an Origin header will be blocked. | Optional |
| `CORS_METHODS`| Allowed HTTP methods (comma-separated) | Optional |
| `CORS_CREDENTIALS` | Enable credentials (`true`/`false`) | Required |
| `IPGUARD_ENABLE` | Enable IP-based guard | true/false |
| `IPGUARD_WINDOW_MS` | IP guard window (ms) | 60000 |
| `IPGUARD_MAX_REQUESTS` | Max requests per IP | 100 |
| `HEADERS_ENABLE` | Enable security headers | true/false |


[!IMPORTANT]
If CORS_ORIGIN is defined, only those origins are allowed, If it is empty or undefined, browser requests with an Origin header will be blocked.

# Initial Setup & Tokens
When you first start the API:
1. **Database tables** are automatically created if they don't exist (currently only `auth_tokens`).
2. **If no tokens are found in the database**, the API will:
- Automatically generate a secure token
- Insert it into the database
- **Print the token to the console once**

This guarantees the API is **never exposed without authentication**, while still being usable on first boot.

> [!WARNING]  
> The generated token is shown **only once** on startup, Copy it immediately and store it securely.

Example console output:
```text
[INFO] Initial token created: 8f3c1d9e6c1a9b4e...
```

You can later manage tokens directly in the database.

### Manual Token Creation (Optional):
```sql
INSERT INTO auth_tokens
(token, name, type, allowed_ips, max_requests, created_at, expires_at)
VALUES
(
  'YOUR_SECRET_TOKEN', -- token
  'Admin token', -- token name
  'personal', -- token type
   -- Allowed IPs are stored in a dedicated table (`auth_token_ips`) with one IP per row
  1000, -- max requests
  UNIX_TIMESTAMP(),
  NULL -- expiration date (uses Unix timestamp in seconds)
);
```
 
- `created_at` uses Unix timestamp in seconds.
- `expires_at` is optional; (`NULL` = no expiration)
- Tokens are **IP-bound**, requests from unauthorized IPs will be rejected.

### Database Setup
Your MySQL user must have access to this database.
> [!IMPORTANT]  
> If this value does not match your actual database name, the server **will fail at startup**.

> Note: IPs are stored in `auth_token_ips` linked by `token_id`.

### Startup Flow:
```bash
pnpm run dev # Development
pnpm run build
pnpm run start # Production
```

On startup, the server will:
- Ensure required tables exist
- Create an initial token **only if none exist**
- Log the generated token to the console (once)
- Continue normally if tokens already exist

This ensures your API is secure by default:
- No open access
- No hardcoded tokens
- No silent misconfiguration

# Middleware
- Applied globally: Authentication, Rate Limiting, IP Guard, Validation, Logging, CORS, Compression, Security Headers, Error Handler.

# Routes & Validation
- Routes are automatically registered from the `src/routes` folder.
- Each route can define its own **Zod schema** for validation.
- Validation middleware is route-specific, ensuring only the routes that need it are validated.
- Example: `validate({ body: schema, query: schema, params: schema })` per route.

### Example structure
```ts
// routes/test.ts
import { Router } from "express";
import { z } from "zod";
import { sendSuccess } from "../core/helpers/response.helper.js";
import { validate } from "../security/validate.middleware.js";

const router = Router();

router.post("/", validate({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		age: z.number().int().min(0, "Age must be a non-negative integer"),
	}),
}), (req, res) => {
	// If we reach here, validation passed
	sendSuccess(res, "Validation passed.", {
		body: req.body,
		query: req.query,
	});
});

export default router;
```

- Routes without validation can be defined normally:
```ts
router.get("/health", (_req, res) => res.json({ status: "ok" }));
```

# Best Practices
- Validate and sanitize `body`, `query`, `params`
- Use `.transform` or `.refine` for trimming, escaping, or parsing
- Reject invalid input early
- Never coerce in business logic

# Response Format
**Success**:
```json
{
	"status": "ok",
	"message": "Health check passed.",
	"data": { ... }
}
```

**Error:**
```json
{
	"status": "error",
	"code": "RATE_LIMIT",
	"message": "Too many requests.",
	"data": null
}
```

# Logging
- Logs requests, status codes, token info, duration
- Logs validation and token refresh events

# Token Management
- Tokens are loaded from the database into memory at startup.
- Refreshed every 60 seconds automatically.
- Supports `personal` or `system` tokens with allowed IPs and optional max requests.

# Security
- Helmet headers for HSTS, X-Frame-Options, XSS protection, CSP.
- IP-bound tokens & IP guard.
- Validation prevents malformed/oversized requests.

# Contributing
- See [CONTRIBUTING.md](CONTRIBUTING.md) for code standards, commit messages, and PR workflow.

# License
MIT License © 2025 Swisser
