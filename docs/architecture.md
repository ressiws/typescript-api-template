# Architecture Overview

## Purpose
This document describes the architecture of **typescript-api-template**, detailing its core components, flow, and rationale behind design decisions.

---

## Core Principles
* **Security-first**: All requests go through authentication, IP-guard, validation, and rate-limiting middleware.
* **Production-ready**: Designed to run in enterprise environments from day one.
* **Modular and maintainable**: Middleware, routes, services, and helpers are decoupled.
* **Scalable**: Adding routes, middlewares, or new authentication mechanisms is straightforward.

---

## System Components

### 1. Token Management
* Tokens are preloaded from the database into memory.
* Types:
  * `personal` – restricted to specific users and optionally max requests.
  * `system` – high privilege, IP-restricted, unlimited by default.
* Tokens refresh automatically every minute without server restart.
* Token validation enforces:
  * Existence
  * IP restrictions
  * Expiration
  * Max request limits

### 2. Middleware Pipeline
1. **Logging** – Tracks request method, path, status, token info, and duration.
2. **Validation** – Uses Zod schemas to validate body, query, and params.
3. **Authentication** – Validates tokens and associated IP restrictions.
4. **Rate Limiting** – Limits requests per token or IP.
5. **IP Guard** – Optional per-IP protection for additional security.
6. **Security Headers** – Enforces headers like CSP, HSTS, X-Frame-Options.
7. **Compression** – Optimizes responses.
8. **Error Handler** – Centralized response for exceptions.

### 3. Routes
* Routes are loaded dynamically from `src/routes`.
* Each route may define a Zod schema for request validation.
* Responses follow a consistent JSON structure:
  * `status`: "success" | "error"
  * `code`: internal error or success code
  * `message` or `data`

### 4. Security Measures
* IP-bound and type-aware token validation
* Rate limiting per token/IP
* Strict request validation to prevent malformed payloads
* CORS configuration with origin/method/credentials support
* Security headers enforced globally
* Logging does **not** include sensitive data

### 5. Configuration
* Environment-based configuration using `.env` file
* All critical security options validated at startup
* Fail-fast behavior on missing/invalid environment variables

---

## Flow Diagram (Simplified)
```yaml
Incoming Request\
│
▼
[Logging Middleware]
│
▼
[Validation Middleware (Zod)]
│
▼
[Authentication Middleware]
│
▼
[Rate Limiting / IP Guard]
│
▼
[Business Logic / Route Handler]
│
▼
[Response + Logging Duration]
```

---

## Notes
* Modular design allows adding new middleware anywhere in the pipeline.
* Tokens and rate-limiting are fully in-memory for speed.
* Designed for enterprise use: secure, reliable, maintainable.