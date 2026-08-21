# Security Policy

Security is a core requirement of this project.

This template is intended to provide a secure foundation, but applications built on top of it remain responsible for their own security model, business logic, authentication and authorization.

## Supported Versions

Security fixes should target the currently maintained version of the project.

| Version        | Supported |
| -------------- | --------- |
| Latest         | Yes       |
| Older versions | No        |

## Reporting a Vulnerability

Do not report security vulnerabilities through public issues or pull requests.

Report vulnerabilities privately through the project's configured security contact or private vulnerability reporting mechanism.

When reporting a vulnerability, include:

* A clear description of the issue.
* The affected component.
* Steps to reproduce the issue.
* The potential impact.
* Relevant logs or screenshots, if safe to provide.
* A suggested mitigation, if known.

Do not include real credentials, API keys, tokens or personal data in the report.

## What Should Be Reported

Examples include:

* Authentication bypasses
* Authorization bypasses
* Remote code execution
* SQL injection
* Command injection
* Path traversal
* SSRF
* Sensitive information disclosure
* Security header bypasses
* CORS misconfiguration that creates a meaningful security impact
* Rate-limit bypasses
* Request validation vulnerabilities
* Denial-of-service vulnerabilities
* Dependency vulnerabilities with a demonstrated impact

## Security Principles

### Input Validation

All external input must be considered untrusted.

Validate:

* request bodies
* query parameters
* route parameters
* headers where applicable
* uploaded files
* external service responses

Validation should happen before application logic processes the data.

### Request Size Limits

Request bodies must have explicit size limits.

Do not increase the global body limit simply because an individual endpoint requires larger payloads.

Prefer endpoint-specific limits when different payload sizes are required.

### Rate Limiting

Publicly accessible endpoints should be protected against abuse.

Rate limits should be adjusted according to the endpoint.

Authentication, password recovery, invitation and other sensitive operations generally require stricter limits than ordinary read operations.

### Headers

Security headers should remain enabled unless there is a documented reason to change them.

Do not disable Helmet protections globally to solve a problem that can be addressed with a specific configuration.

### CORS

CORS must be explicitly configured.

Avoid unrestricted production configurations such as:

```text
*
```

when credentials or private resources are involved.

Only trusted origins should receive access to protected resources.

### Logging

Never log:

* passwords
* access tokens
* refresh tokens
* session tokens
* API keys
* authorization headers
* cookies containing credentials
* other secrets

Sensitive fields should be redacted before logs are written.

### Error Responses

Production responses must not expose internal implementation details.

Do not return:

* stack traces
* filesystem paths
* database queries
* environment variables
* dependency internals

Internal details should remain in server-side logs.

### Secrets

Secrets must be supplied through environment-specific secret management.

Never commit:

```text
.env
```

or credentials directly into source code.

Use:

```text
.env.example
```

for documenting required variables without providing real values.

### Dependencies

Dependencies must be kept reasonably up to date.

Security advisories should be reviewed rather than blindly ignored.

A dependency with a vulnerability is not automatically exploitable, but its actual impact must be assessed.

## Production Checklist

Before deploying an application based on this template:

* [ ] Production secrets are configured securely.
* [ ] Debug logging is disabled or appropriately restricted.
* [ ] CORS origins are explicitly configured.
* [ ] Rate limits are configured for the expected traffic.
* [ ] Request body limits are appropriate.
* [ ] Security headers are enabled.
* [ ] API documentation is not unnecessarily exposed publicly.
* [ ] Authentication and authorization are implemented where required.
* [ ] Sensitive data is not present in logs.
* [ ] Error responses do not expose internal details.
* [ ] Dependencies are up to date.
* [ ] HTTPS is enforced at the appropriate infrastructure layer.
* [ ] Database and external service credentials are protected.

## Disclosure

Confirmed vulnerabilities should be handled privately until a fix or mitigation is available.

After remediation, the project may publish a security advisory containing the affected versions, impact and mitigation.

## Scope

The security of an application built using this template depends on the application itself.

This project provides infrastructure and security defaults, but it cannot guarantee that an application built on top of it is secure.

Business logic, authentication, authorization, database queries and external integrations must be reviewed independently.
