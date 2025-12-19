### typescript-api-template
**Version:** 1.0.0 \
**License:** MIT

---

# Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install dependencies](#2-install-dependencies)
  - [Create your `.env` file](#3-create-your-env-file)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Start in Development](#start-in-development)
  - [Build & Start for Production](#build--start-for-production)
- [Middleware](#middleware)
- [Routes & Validation](#routes--validation)
- [Response Format](#response-format)
- [Logging](#logging)
- [Token Management](#token-management)
- [Security](#security)
- [Best Practices for Zod & Input Sanitization](#best-practices-for-zod--input-sanitization)
- [Contributing](#contributing)
- [License](#license)
- [Why Use This Base?](#why-use-this-base)

---

# Overview
typescript-api-template is a **robust and scalable API base** build with **Node.js**, **Typescript**, **and Express**.
Designed for production from day one, it includes:

- Token-based authentication with IP restrictions (`system` and `personal` tokens)
- Rate limiting per token or IP
- Global request validation with **Zod** schemas
- Structured logging for requests, tokens, and errors
- Configurable CORS support for secure cross-origin requests
- Security Headers for XSS, clickjacking, and other attacks
- IP guard for per-IP request protection
- JSON and payload protection against malformed or oversized requests
- Modular route registration and middleware
- Easy-to-use enviroment configuration
- Automatic token reloading and in-memory caching

This base is ideal for **internal tools, enterprise applications, or public APIs** requiring strict security and maintainability.

# Documentation

For detailed internal docs, see:

- [Routes](./routes.md) – Route structure and Zod validation
- [Security](security.md) – Security model, threat mitigation, logging
- [Architecture](./architecture.md) – Project layout, middleware flow, token refresh
- [Configuration](./configuration.md) – All environment variables and defaults

> Note: Tokens must include at least one allowed IP. There is no default fallback token.

# Features
| Feature | Description |
| ------- | ----------- |
| **Authentication** | Token-based, IP-bound, and with expiration checks. Configurable via `.env`. |
| **Rate Limiting** | Per-token/IP limits to prevent abuse. Fully configurable. |
| **Validation** | Automatic request validation using Zod for body, query, and params. |
| **Logging** | Detailed request and error logging with token context and duration. |
| **CORS** | Configurable allowed origins, methods, and credentials. |
| **Security Headers** | Adds recomended HTTP headers to protect against XSS, clickjacking, and other attacks. |
| **IP Guard** | Limits requests per IP to prevent abuse and brute-force attacks. Configurable via `.env` |
| **JSON & Paylod Protection** | Rejects malformed JSON, oversized requests (>10kb), and unexpected fields. Ensures server stability |
| **Hot Token Reload** | Tokens are refreshed every minute without server restart. |
| **Modular Design** | Routes, middleware, and services are separated for clarity and scalability. |

# Installation
### 1. Clone the Repository
```bash
git clone https://github.com/ressiws/typescript-api-template.git
cd typescript-api-template
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Create your `.env` file
Use `.env.example` as a reference and configure your environment variables.

# Environment Variables
|  Variable  | Description | Default / Required |
| ---------- | ----------- | ------------------ |
| `NODE_ENV` | Environment mode (`development`, `production`) | Required |
| `APP_NAME` | Application name | Required |
| `APP_PORT` | Port number | Required |
| `DB_HOST`  | Database host | Required |
| `DB_USER`  | Database username | Required |
| `DB_PASS`  | Database password | Required |
| `AUTH_ENABLE` | Enable authentication middleware | true/false |
| `RATE_LIMIT_ENABLE` | Enable rate limiting | true/false |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 60000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `LOGGING_ENABLE` | Enable request/error logging | true/false |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | Optional |
| `CORS_METHODS`| Allowed HTTP methods (comma-separated) | Optional |
| `CORS_CREDENTIALS` | Enable credentials (`true`/`false`) | Optional |
| `IPGUARD_ENABLE` | Enable IP-based guard | true/false |
| `IPGUARD_WINDOW_MS` | IP guard window (ms) | 60000 |
| `IPGUARD_MAX_REQUESTS` | Max requests per IP | 100 |
| `HEADERS_ENABLE` | Enable security headers | true/false |
| `CSP_POLICY` | Content-Security-Policy | `default-src 'self'; frame-ancestors 'none'; base-uri 'none';` |


> [!NOTE]  
> Leaving `CORS_ORIGIN` or `CORS_METHODS` empty will allow all origins and methods by default.

# Initial Setup & Tokens
When you first start the API:
1. **Database tables** are automatically created if they don't exist (currently only `auth_tokens` is required).
2. **No tokens are created automatically**. You must insert at least one token manually to acess the API.

Example SQL to create a personal token:
```sql
INSERT INTO auth_tokens
(token, name, type, allowed_ips, max_requests, created_at, expires_at)
VALUES
(
  'YOUR_SECRET_TOKEN', -- token
  'Admin token', -- token name
  'personal', -- token type
  '["127.0.0.1"]', -- array of allowed IPs
  1000, -- max requests
  UNIX_TIMESTAMP(),
  NULL -- expiration date (uses Unix timestamp in seconds)
);
```
 
> `created_at` uses Unix timestamp in seconds. \
> `expires_at` uses Unix timestamp,. is optional; leave NULL for a non-expiring token. \
> Make sure your token is secure and never commit it to version control.

### Database Setup
Before running the server, make sure to update the database configuration in `src/core/services/database.ts`:
```ts
export enum DatabaseType {
	Main = "api_swisser" // <-- Change this to the name of your database
}
```

Your MySQL user must have access to this database. The table `auth_tokens` will be automatically created if it does not exist, and an initial token will be generated for you.

> [!IMPORTANT]  
> If you don't change this to match your actual database, the server will fail to start.

### Startup Flow:
```bash
pnpm run dev # Development
pnpm run build
pnpm run start # Production
```

On startup, the server will:
- Log that it created any missing tables.
- Fail if no tokens are loaded (you must create at least one).

This ensures your API is secure by default: no default tokens, no accidental open access.

# Middleware
All middleware is automatically applied globally:\
**1. Authentication** - Validates token, IP, and expiration.\
**2. Rate Limiting** - Enforces request limits per token/IP.\
**3. IP Guard** - Limits requests per IP to prevent abuse.\
**4. Validation** - Validates request body, query, and params using Zod schemas. Rejects malformed JSON or unexpected fields.\
**5. Logging** - Logs requests, status codes, token info, and duration.\
**6. CORS & Compression** - Configurable cross-origin support and response compression.\
**7. Security Headers** - Adds recomended headers (CSP, HSTS, X-Frame-Options, etc.)\
**8. Error Handler** - Unified error responses with structured error codes.

# Routes & Validation
- Routes are automatically registered from the `src/routes` folder.
- Each route can define its own **Zod schema** for validation.
- Example structure:
```bash
src/routes/
 ├─ health.ts
 └─ users.ts
```

# Best Practices for Zod & Input Sanitization
- Always define a schema for `body`, `query`, and `params`.
- Use `transform` or `refine` for sanitization (trim strings, parse numbers, escape - HTML).
- Reject invalid payloads immediately to prevent downstream logic from executing.
- Never coerce automatically in business logic—always validate first.
- Example:
```ts
import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(32).transform(s => s.trim()),
  email: z.string().email().transform(s => s.toLowerCase()),
  age: z.number().optional()
});

router.post("/users", async (req, res) => {
  // req.body is already validated and sanitized
  const user = req.body;
  // business logic...
  res.json({ status: "success", data: user, code: "SUCCESS" });
});
```

_Always sanitize and validate all user inputs._

# Response Format
All API responses are standardized:

**Success**:
```json
{
	"status": "success",
	"data": { ... },
	"code": "SUCCESS"
}
```

**Error:**
```json
{
	"status": "error",
	"error": "Rate limit exceeded",
	"code": "RATE_LIMIT"
}
```

# Logging
- Every request logs: method, path, status code, token info, duration.
- Token load and refresh logs included.
- Validation errors logged with route info.
> Example:
```less
[INFO] [REQ] GET /tokens | Status: 200 | TokenID:1 Type:system | Duration: 3.90ms
[WARN] Validation failed for POST /users: Invalid email
```

# Token Management
- Tokens are loaded from the database into memory at startup.
- Refreshed every 60 seconds automatically.
- Supports `personal` or `system` tokens with allowed IPs and optional max requests.

# Security
- **IP-bound tokens** - Requests from unauthorized IPs are blocked.
- **Rate-limiting** - Prevents abuse and brute-force attacks.
- **IP Guard** - Limits requests per IP for extra protection.
- **Validation middleware** - Prevents malformed requests, oversized payloads, or unexpected fields.
- **CORS** - Configurable for controlled access.
- **Security Headers** - Protect against common attacks (XSS, clickjacking, etc.)

# Contributing
- See [CONTRIBUTING.md](CONTRIBUTING.md) for code standards, commit messages, and PR workflow.

# License
MIT License © 2025 Swisser

# Why Use This Base?
- **Production-ready**: built with best practices for security, validation, and logging.
- **Scalable**: Modular design allows easy extension with new routes and middleware.
- **Enterprise-grade**: standardized responses, error codes, and global middlewares.
- **Safe & reliable**: handles malformed JSON, large payloads, and invalid requests gracefully.
- **Easy configuration**: everything controlled via environment variables for flexibility.
> Use typescript-api-template as your **starting point for any Node.js/TypeScript enterprise project**. It gives you security, reliability, and maintainability out of the box.