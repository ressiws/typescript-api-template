# Security Policy

## Overview

This project follows a **security-first architecture**. Security is not an optional layer, it is enforced at configuration, middleware, and service levels.

This document explains the threat model, protections in place, and how to responsibly report vulnerabilities.

---

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes     |
| < 1.0   | ❌ No      |

Only the latest major version receives security updates.

---

## Threat Model (High-Level)

The API is designed to defend against:

* Unauthorized access
* Token leakage and reuse
* IP spoofing
* Request flooding / brute force
* Invalid or malicious payloads
* Information leakage via errors

Out of scope:

* Physical server compromise
* OS-level vulnerabilities
* Misconfigured reverse proxies

---

## Security Controls

### Authentication

* Token-based authentication
* Tokens are:

  * Preloaded into memory
  * IP-restricted
  * Expirable
  * Reloaded periodically

If authentication is disabled via config, middleware short-circuits safely.

---

### Rate Limiting

* Global rate limiting middleware
* Configurable per environment
* Token-aware request limits
* Hard fail on limit breach

Designed to protect both infrastructure and upstream services.

---

### Input Validation

* Centralized request validation
* Strict schema enforcement
* No implicit coercion
* Fail-fast on invalid input

Invalid requests **never reach business logic**.

---

### Logging & Auditing

* Structured request logs
* Token context included when available
* Duration and status tracking
* No sensitive data logged

Logs are designed for:

* Incident response
* Abuse detection
* Performance analysis

---

### Configuration Safety

* Environment variables validated at startup
* Application fails fast on misconfiguration
* No silent defaults for security-critical options

---

## Reporting a Vulnerability

**Do not open public issues for security vulnerabilities.**

Instead, report responsibly:

* Email: [me@swisser.pt](mailto:me@swisser.pt)
* Include:

  * Description of the issue
  * Steps to reproduce
  * Potential impact

You will receive an acknowledgement within 48 hours.

---

## Security Philosophy

> Security is enforced by design, not by convention.

If a feature weakens the security model, it does not ship.
