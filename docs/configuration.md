# Configuration Guide

## Purpose
This document describes the configuration structure for **typescript-api-template** and how each environment variable affects the system.

---

## Environment Variables

| Variable | Description | Default / Required |
| -------- | ----------- | ----------------- |
| `NODE_ENV` | Node environment (`development`, `production`) | Required |
| `APP_NAME` | Application name | Required |
| `APP_PORT` | Server port | Required |
| `APP_VERSION` | App version | Required |
| `DB_HOST` | Database host | Required |
| `DB_USER` | Database user | Required |
| `DB_PASS` | Database password | Required |
| `AUTH_ENABLE` | Enables token-based authentication | true/false |
| `RATE_LIMIT_ENABLE` | Enables rate-limiting middleware | true/false |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | 60_000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 20 |
| `LOGGING_ENABLE` | Enables request/error logging | true/false |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | Optional |
| `CORS_METHODS` | Allowed HTTP methods (comma-separated) | Optional |
| `CORS_CREDENTIALS` | Allow credentials | true/false |
| `HEADERS_ENABLE` | Enable security headers | true/false |
| `CSP_POLICY` | Content-Security-Policy string | Optional |
| `IPGUARD_ENABLE` | Enable IP-guard | true/false |
| `IPGUARD_WINDOW_MS` | Window for IP-guard in ms | 60_000 |
| `IPGUARD_MAX_REQUESTS` | Max requests per IP | 100 |

---

## Guidelines

* **Boolean values**: must be `"true"` or `"false"` (case-insensitive).  
* **Numeric values**: must be integers, validated at startup.  
* **CORS**: If `CORS_ORIGIN` or `CORS_METHODS` are empty, defaults to allow all.  
* **Security-critical options**: Always validated; server fails fast if missing or invalid.  
* **Logging**: Controlled via `LOGGING_ENABLE`. Debug logs disabled automatically in production.

---

## Best Practices

* Never commit `.env` with production credentials.  
* Use separate `.env` files per environment (`.env.development`, `.env.production`).  
* Tune `RATE_LIMIT_*` and `IPGUARD_*` according to expected traffic and security requirements.  
* Review `CSP_POLICY` to match your frontend resources.  

---

## Example `.env`
```yaml
# -------------------------------------------------------
# Node environment
# -------------------------------------------------------
NODE_ENV=production

# -------------------------------------------------------
# Application settings
# -------------------------------------------------------
APP_NAME=typescript-api-template
APP_PORT=3000
APP_VERSION=1.0.0

# -------------------------------------------------------
# Database credentials
# -------------------------------------------------------
DB_HOST=localhost
DB_USER=root
DB_PASS=password

# -------------------------------------------------------
# Security settings
# -------------------------------------------------------
# Headers
HEADERS_ENABLE=true
CSP_POLICY=default-src 'self'; frame-ancestors 'none'; base-uri 'none';

# IP Guard
IPGUARD_ENABLE=true
IPGUARD_WINDOW_MS=60000
IPGUARD_MAX_REQUESTS=100

# Auth
AUTH_ENABLE=true

# Rate Limit
RATE_LIMIT_ENABLE=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

# Logging
LOGGING_ENABLE=true

# -------------------------------------------------------
# CORS settings (optional)
# If empty, defaults to allowing all origins/methods
# Use comma-separated values for multiple entries
# -------------------------------------------------------
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CORS_METHODS=GET,POST,PATCH,DELETE
CORS_CREDENTIALS=false
```